/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import * as _ from "underscore";
import createBlock from "../block/factory";
import Config from "../config";
import AttributeReaderComposite from "../format/read/composite";
import Stage from "../stage";
import EditableArea from "./structural/editable-area";
import {EditableAreaInterface} from "./structural/editable-area.d";

export default class Build {
    public stage: Stage;
    private stageElement: Element;
    private attributeReaderComposite: AttributeReaderComposite;
    private fieldValue: string;
    private stageDocument: Element;

    constructor(fieldValue: string) {
        this.attributeReaderComposite = new AttributeReaderComposite();
        this.fieldValue = fieldValue;
    }

    /**
     * Can we build Page Builder from the fields value?
     *
     * @returns {boolean}
     */
    public canBuild() {
        // Create a document with a role of stage to wrap the contents
        this.stageDocument = document.createElement("div");
        this.stageDocument.setAttribute(Config.getValueAsString("dataRoleAttributeName"), "stage");
        this.stageDocument.innerHTML = this.fieldValue;

        // Validate if the new stage contains any rows, if it doesn't it's not compatible with our system
        return !!this.stageDocument.querySelector("[" + Config.getValueAsString("dataRoleAttributeName") + "='row']");
    }

    /**
     * Build the stage
     *
     * @param stage
     * @returns {Build}
     */
    public buildStage(stage: Stage) {
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
    public buildElement(element: Element, parent: EditableArea) {
        if (element instanceof HTMLElement
            && element.getAttribute(Config.getValueAsString("dataRoleAttributeName"))
        ) {
            const childPromises: Array<Promise<EditableArea>> = [];
            const childElements: Element[] = [];
            const elementChildren = this.getElementChildren(element);

            if (elementChildren.length > 0) {
                _.forEach(elementChildren, (childElement: Element) => {
                    childPromises.push(this.createBlock(childElement, parent || this.stage));
                    childElements.push(childElement);
                });
            }

            // Wait for all the promises to finish and add the instances to the stage
            return Promise.all(childPromises).then((children) => children.forEach((child, index) => {
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
    public createBlock(element: Element, parent: EditableArea): Promise<EditableArea> {
        parent = parent || this.stage;
        const role = element.getAttribute(Config.getValueAsString("dataRoleAttributeName"));

        return this.getElementData(element).then((data) => createBlock(
            Config.getInitConfig("contentTypes")[role],
            parent,
            this.stage,
            data,
        ));
    }

    /**
     * Retrieve the elements data
     *
     * @param element
     * @returns {{}}
     */
    public getElementData(element: Element) {
        const result = {};
        const readPromise = this.attributeReaderComposite.read(element);
        return readPromise.then((data) => {
            return result ? _.extend(result, data) : {};
        });
    }

    /**
     * Return elements children, search for direct decedents, or traverse through to find deeper children
     *
     * @param element
     * @returns {Array}
     */
    public getElementChildren(element: Element) {
        if (element.hasChildNodes()) {
            let children: any[] = [];
            // Find direct children of the element
            _.forEach(element.childNodes, (child: HTMLElement) => {
                // Only search elements which tagName"s and not script tags
                if (child.tagName && child.tagName !== "SCRIPT") {
                    if (child.hasAttribute(Config.getValueAsString("dataRoleAttributeName"))) {
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
