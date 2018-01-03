/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as _ from 'underscore';
import {StageInterface} from '../stage.d';
import EventEmitter from '../event-emitter';
import Config from '../config';
import createBlock from '../block/factory';
import {EditableAreaInterface} from './structural/editable-area.d';
import Block from '../block/block';
import AttributeReaderComposite from '../format/read/composite';
import Stage from "../stage";
import EditableArea from "./structural/editable-area";

export default class Build extends EventEmitter {
    fieldValue: string;
    stage: Stage;
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
    buildStage(stage: Stage) {
        this.stage = stage;

        // Iterate through the stages children
        return this.buildElement(this.stageDocument, this.stage);
    }

    /**
     * Build an element and it's children into the stage
     *
     * @param {Element} element
     * @param {EditableArea} parent
     * @returns {Promise<void>}
     */
    buildElement(element: Element, parent: EditableArea) {
        if (element instanceof HTMLElement
            && element.getAttribute(Config.getValueAsString('dataRoleAttributeName'))
        ) {
            let childPromises: Array<Promise<EditableArea>> = [],
                childElements: Array<Element> = [],
                children = this.getElementChildren(element);

            if (children.length > 0) {
                _.forEach(children, (childElement: Element) => {
                    childPromises.push(this.createBlock(childElement, this.stage));
                    childElements.push(childElement);
                });
            }

            // Wait for all the promises to finish and add the instances to the stage
            return Promise.all(childPromises).then(children => children.forEach((child, index) => {
                parent.addChild(child);
                this.buildElement(childElements[index], child);
            }));
        }
    }

    /**
     * Parse an element in the structure and build the required element
     *
     * @param {Element} element
     * @param {EditableArea} parent
     * @returns {Promise<EditableAreaInterface>}
     */
    createBlock(element: Element, parent: EditableArea): Promise<EditableArea> {
        parent = parent || this.stage;
        let self = this,
            role = element.getAttribute(Config.getValueAsString('dataRoleAttributeName'));

        return this.getElementData(element).then(data => createBlock(
            Config.getInitConfig('contentTypes')[role],
            parent,
            this.stage,
            data
        ));
    }

    /**
     * Retrieve the elements data
     *
     * @param element
     * @returns {{}}
     */
    getElementData(element: Element) {
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
    getElementChildren(element: Element) {
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
}
