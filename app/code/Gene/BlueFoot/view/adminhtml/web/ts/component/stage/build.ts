import * as _ from 'underscore';
import EventEmitter from '../event-emitter';
import Config from '../config';
import createBlock from '../block/factory';
import { EditableAreaInterface } from './structural/editable-area.d';
import { RowInterface } from './structural/row.d';
import { ColumnInterface } from './structural/column.d';
import Block from '../block/block';
import AttributeReaderComposite from './attribute-reader-composite';
import Stage from "../stage";
import EditableArea from "./structural/editable-area";
import {DataObject} from "../data-store";

/**
 * Build Class
 *
 * @author Dave Macaulay <hello@davemacaulay.com>
 */
export default class Build extends EventEmitter {
    stage: Stage;
    document: Element;
    attributeReaderComposite: AttributeReaderComposite;

    /**
     */
    constructor() {
        super();
        this.attributeReaderComposite = new AttributeReaderComposite();
    }

    /**
     * Parse the potential structure
     *
     * @param structure
     */
    parseStructure(structure: string) {
        this.document = document.createElement('div');
        this.document.innerHTML = '<div data-role="stage">' + structure + '</div>';

        // Return the stage element if the structure is present, otherwise return false
        return this.document.querySelector('[' + Config.getValue('dataRoleAttributeName') + '="stage"]') || false;
    }

    /**
     * Build the stage
     *
     * @param stage
     * @param stageElement
     * @returns {Build}
     */
    buildStage(stage: Stage, stageElement: HTMLElement) {
        this.stage = stage;
        this.parseAndBuildStage(stageElement);
        return this;
    }

    /**
     * Parse and build the stage from the stage element
     *
     * @param stageElement
     * @returns {Promise<T>}
     */
    parseAndBuildStage(stageElement: HTMLElement) {
        return this.parseAndBuildElement(stageElement, this.stage)
            .then(() => {
                this.emit('buildDone');
            }).catch((error: string) => {
                this.emit('buildError', error);
            });
    }

    /**
     * Parse an element in the structure and build the required element
     *
     * @param element
     * @param parent
     * @returns {Promise<EditableAreaInterface>}
     */
    parseAndBuildElement(element: HTMLElement, parent: EditableAreaInterface): Promise<{}> {
        if (element instanceof HTMLElement &&
            element.getAttribute(Config.getValueAsString('dataRoleAttributeName'))
        ) {
            parent = parent || this.stage;
            let self = this,
                role = element.getAttribute(Config.getValueAsString('dataRoleAttributeName'));


            let getElementDataPromise = new Promise(function (resolve: Function, error: string) {
                resolve(self.getElementData(element))
            }.bind(this));

            return getElementDataPromise.then(function (data: object) {
                let children = this.getElementChildren(element);
                // Add element to stage
                return this.buildElement(role, data, parent).then(function (newParent: EditableArea) {
                    if (children.length > 0) {
                        let childPromises: Array<any> = [];
                        _.forEach(children, function (child: HTMLElement) {
                            childPromises.push(self.parseAndBuildElement(child, newParent));
                        });
                        return Promise.all(childPromises);
                    } else {
                        return Promise.resolve(newParent);
                    }
                });
            }.bind(this));
        } else {
            return Promise.reject(new Error('Element does not contain valid role attribute.'));
        }
    }

    /**
     * Retrieve the elements data
     *
     * @param element
     * @returns {{}}
     */
    getElementData(element: HTMLElement): object {
        let result = {};
        let readPromise = new Promise(function (resolve: Function, reject: Function) {
            resolve(this.attributeReaderComposite.read(element));
        }.bind(this));
        return readPromise.then(function (data) {
            return result ? _.extend(result, data) : {}
        });
    }

    /**
     * Return elements children, search for direct decedents, or traverse through to find deeper children
     *
     * @param element
     * @returns {Array}
     */
    getElementChildren(element: HTMLElement) {
        if (element.hasChildNodes()) {
            let children: Array<any> = [];
            // Find direct children of the element
            _.forEach(element.childNodes, (child: HTMLElement) => {
                // Only search elements which tagName's and not script tags
                if (child.tagName && child.tagName != 'SCRIPT') {
                    if (child.hasAttribute(Config.getValueAsString('dataRoleAttributeName'))) {
                        children.push(child);
                    } else {
                        children = this.getElementChildren(child);
                    }
                }
            });

            if (children.length > 0) {
                return children;
            }
        }

        return [];
    }

    /**
     * Forward build instruction to necessary build function
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise<EditableAreaInterface>}
     */
    buildElement(role: string, data: object, parent: any): Promise<EditableAreaInterface> {
        switch (role) {
            case 'stage':
                // If the stage is being built, we don't need to "build" anything, just return the stage as the
                // new parent
                return Promise.resolve(this.stage);
            case 'row':
                return this.buildRow(data, parent);
            case 'column':
                return this.buildColumn(data, parent);
            default:
                return this.buildEntity(role, data, parent);
        }
    }

    /**
     * Build a new row with it's associated data
     *
     * @param data
     * @param parent
     * @returns {Promise<RowInterface>}
     */
    private buildRow(data: object, parent: Stage): Promise<RowInterface> {
        return Promise.resolve(parent.addRow(this.stage, data));
    }

    /**
     * Build a new column with it's associated data
     *
     * @param data
     * @param parent
     * @returns {Promise<ColumnInterface>}
     */
    private buildColumn(data: object, parent: RowInterface | ColumnInterface): Promise<ColumnInterface> {
        return Promise.resolve(parent.addColumn(data));
    }

    /**
     * Add an entity into the system
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise<T>}
     */
    private buildEntity(role: string, data: object, parent: EditableArea): Promise<Block> {
        return new Promise(function (resolve: Function, reject: Function) {
            createBlock(
                Config.getContentBlockConfig(role),
                parent,
                this.stage,
                data
            ).then(function (block) {
                parent.addChild(block);
                resolve(block);
            }).catch(function (error) {
                reject(error);
            });
        }.bind(this));
    }
}