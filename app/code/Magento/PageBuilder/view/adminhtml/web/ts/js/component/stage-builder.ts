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
 * @param {stage} stage
 * @param {string} value
 * @returns {Promise<void>}
 */
function buildStageFromPageBuilderContent(stage: Stage, value: string) {
    let stageDocument = document.createElement('div');
    stageDocument.setAttribute(Config.getValueAsString('dataRoleAttributeName'), 'stage');
    stageDocument.innerHTML = value;
    return buildElementIntoStage(stageDocument, stage, stage);
}

/**
 * Build an element and it's children into the stage
 *
 * @param {Element} element
 * @param {EditableArea} parent
 * @param {stage} stage
 * @returns {Promise<void>}
 */
function buildElementIntoStage(element: Element, parent: EditableArea, stage: Stage) {
    if (element instanceof HTMLElement
        && element.getAttribute(Config.getValueAsString('dataRoleAttributeName'))
    ) {
        let childPromises: Array<Promise<EditableArea>> = [],
            childElements: Array<Element> = [],
            children = getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: HTMLElement) => {
                childPromises.push(createElementBlock(childElement, stage, stage));
                childElements.push(childElement);
            });
        }

        // Wait for all the promises to finish and add the instances to the stage
        return Promise.all(childPromises).then(children => children.forEach((child: Structural, index) => {
            parent.addChild(child);
            buildElementIntoStage(childElements[index], child, stage);
        }));
    }
}

/**
 * Parse an element in the structure and build the required element
 *
 * @param {Element} element
 * @param {EditableArea} parent
 * @param {stage} stage
 * @returns {Promise<EditableAreaInterface>}
 */
function createElementBlock(element: HTMLElement, parent: EditableArea, stage: Stage): Promise<EditableArea> {
    parent = parent || stage;
    let role = element.getAttribute(Config.getValueAsString('dataRoleAttributeName'));

    return getElementData(element).then((data: object) => createBlock(
        Config.getInitConfig('contentTypes')[role],
        parent,
        stage,
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
                    children = getElementChildren(child);
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
function buildNewStageInstance(stage: Stage, initialValue: string) {
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
 * @param {function} stageBinder
 * @returns {Stage}
 */
export default function build(parent: any, panel: Panel, stageContent: KnockoutObservableArray<Structural>, initialValue: string, stageBinder: (stage: Stage) => void) {
    // Create a new instance of the stage
    const stage: any = new Stage(
        parent,
        stageContent,
    );

    if(typeof stageBinder !== "undefined"){
        stageBinder(stage);
    }

    let build;

    // Bind the panel to the stage
    panel.bindStage(stage);

    // Determine if we're building from existing page builder content
    if (isPageBuilder(initialValue)) {
        build = buildStageFromPageBuilderContent(stage, initialValue);

    } else {
        build = buildNewStageInstance(stage, initialValue);
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
