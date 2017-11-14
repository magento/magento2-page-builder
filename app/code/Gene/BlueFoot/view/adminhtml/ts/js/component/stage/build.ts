/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as _ from 'underscore';
import { StageInterface } from '../stage.d';
import EventEmitter from '../event-emitter';
import Config from '../config';
import createBlock from '../block/factory';
import { EditableAreaInterface } from './structural/editable-area.d';
import { RowInterface } from './structural/row.d';
import { ColumnInterface } from './structural/column.d';
import Block from '../block/block';
import AttributeReaderComposite from '../format/read/composite';

export default class Build extends EventEmitter {
    fieldValue: string;
    stage: StageInterface;
    stageElement: Element;
    stageDocument: Element;
    attributeReaderComposite: AttributeReaderComposite;
    
    constructor(fieldValue: string) {
        super();
        this.attributeReaderComposite = new AttributeReaderComposite();
        this.fieldValue = fieldValue;
    }

    /**
     * Can we build Page Builder from the fields value?
     *
     * @returns {boolean}
     */
    canBuild() {
        // Create a document with a role of stage to wrap the contents
        this.stageDocument = document.createElement('div');
        this.stageDocument.setAttribute(Config.getValueAsString('dataRoleAttributeName'), 'stage');
        this.stageDocument.innerHTML = this.fieldValue;

        // Validate if the new stage contains any rows, if it doesn't it's not compatible with our system
        return !!this.stageDocument.querySelector('[' + Config.getValueAsString('dataRoleAttributeName') + '="row"]');
    }

    /**
     * Build the stage
     *
     * @param stage
     * @returns {Build}
     */
    buildStage(stage: StageInterface) {
        this.stage = stage;

        return this.parseAndBuildElement(this.stageDocument, this.stage);
    }

    /**
     * Parse an element in the structure and build the required element
     *
     * @param element
     * @param parent
     * @returns {Promise<EditableAreaInterface>}
     */
    parseAndBuildElement(element: Element, parent: EditableAreaInterface): Promise<EditableAreaInterface> {
        if (element instanceof HTMLElement
            && element.getAttribute(Config.getValueAsString('dataRoleAttributeName'))
        ) {
            parent = parent || this.stage;
            let self = this,
                role = element.getAttribute(Config.getValueAsString('dataRoleAttributeName'));

            let getElementDataPromise = new Promise((resolve: Function, error: Function) => {
                resolve(self.getElementData(element));
            });

            return getElementDataPromise.then((data) => {
                let children = this.getElementChildren(element);
                // Add element to stage
                return this.buildElement(role, data, parent).then((newParent) => {
                    if (children.length > 0) {
                        let childPromises: Array<Promise<EditableAreaInterface>> = [];
                        _.forEach(children, function (child) {
                            childPromises.push(self.parseAndBuildElement(child, newParent));
                        });
                        return Promise.all(childPromises);
                    } else {
                        return newParent;
                    }
                });
            });
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
    getElementData(element: HTMLElement) {
        let result = {};
        const readPromise = this.attributeReaderComposite.read(element);
        return readPromise.then((data) => {
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
            default:
                return this.buildEntity(role, data, parent);
        }
    }

    /**
     * Add an entity into the system
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise<T>}
     */
    private buildEntity(role: string, data: object, parent: EditableAreaInterface): Promise<Block> {
        return new Promise(function (resolve, reject) {
            createBlock(
                Config.getInitConfig('contentTypes')[role],
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
