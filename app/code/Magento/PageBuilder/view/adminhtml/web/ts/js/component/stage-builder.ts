/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Stage from "./stage";
import Panel from "./stage/panel";
import Structural from "./stage/structural/abstract";
import isPageBuilder from "./format/format-validator";
import $t from "mage/translate";
import Config from "./config";
import createBlock from "./block/factory";
import Block from "./block/block";
import * as _ from 'underscore';
import {EditableAreaInterface} from './stage/structural/editable-area.d';
import AttributeReaderComposite from './format/read/composite';
import EditableArea from "./stage/structural/editable-area";

/**
 * Build the stage with the provided value
 *
 * @param {string} value
 * @returns {Promise<void>}
 */
function buildStage(value: string) {
    let stageDocument = document.createElement('div');
    stageDocument.setAttribute(Config.getValueAsString('dataRoleAttributeName'), 'stage');
    stageDocument.innerHTML = value;
    return this.buildElement(stageDocument, this.stage);
}

/**
 * Build an element and it's children into the stage
 *
 * @param {Element} element
 * @param {EditableArea} parent
 * @returns {Promise<void>}
 */
function buildElement(element: Element, parent: EditableArea) {
    if (element instanceof HTMLElement
        && element.getAttribute(Config.getValueAsString('dataRoleAttributeName'))
    ) {
        let childPromises: Array<Promise<Structural>> = [],
            childElements: Array<Element> = [],
            children = this.getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: Element) => {
                childPromises.push(this.createElementBlock(childElement, this.stage));
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
function createElementBlock(element: Element, parent: EditableArea): Promise<EditableArea> {
    parent = parent || this.stage;
    let role = element.getAttribute(Config.getValueAsString('dataRoleAttributeName'));

    return this.getElementData(element).then((data: object) => createBlock(
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
function getElementData(element: HTMLElement) {
    let result = {};
    let attributeReaderComposite = new AttributeReaderComposite();

    const readPromise = attributeReaderComposite.read(element);
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
function getElementChildren(element: Element) {
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
 * Build a new instance of stage, add row & text content types if needed
 *
 * @param {Stage} stage
 * @param {string} initialValue
 * @returns {Promise<any>}
 */
function buildNew(stage: Stage, initialValue: string) {
    return new Promise((resolve) => {
        const rowConfig = Config.getContentType('row');
        const textConfig = Config.getContentType('text');
        if (rowConfig) {
            createBlock(rowConfig, stage, stage, {}).then((row: Block) => {
                stage.addChild(row);
                if (textConfig && initialValue) {
                    createBlock(
                        textConfig,
                        stage,
                        stage,
                        {
                            content: initialValue
                        }
                    ).then((text: Block) => {
                        row.addChild(text);
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        } else {
            // The row content type can not exist and the system be functional
            resolve();
        }
    });
}

/**
 * Build a stage with the provided parent, content observable and initial value
 *
 * @param parent
 * @param panel
 * @param {KnockoutObservableArray<Structural>} stageContent
 * @param {string} initialValue
 * @returns {Stage}
 */
export default function build(parent: any, panel: Panel, stageContent: KnockoutObservableArray<Structural>, initialValue: string) {
    // Create a new instance of the stage
    const stage: any = new Stage(
        parent,
        stageContent,
    );
    let build;

    // Bind the panel to the stage
    panel.bindStage(stage);

    // Determine if we're building from existing page builder content
    if (isPageBuilder(initialValue)) {
        build = this.buildStage(initialValue);

    } else {
        build = this.buildNew(stage, initialValue);
    }

    // Once the build process is finished the stage is ready
    build.then(stage.ready.bind(stage))
        .catch((error: Error) => {
            parent.alertDialog({
                title: $t('Advanced CMS Error'),
                content: $t("An error has occurred while initiating the content area.")
            });
            stage.emit('stageError', error);
            console.error( error );
        });

    return stage;
}
