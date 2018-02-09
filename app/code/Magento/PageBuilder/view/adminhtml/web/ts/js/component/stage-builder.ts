/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import * as _ from "underscore";
import Block from "./block/block";
import createBlock from "./block/factory";
import Config from "./config";
import validateFormat from "./format/format-validator";
import AttributeReaderComposite from "./format/read/composite";
import Stage from "./stage";
import Panel from "./stage/panel";
import Structural from "./stage/structural/abstract";
import EditableArea from "./stage/structural/editable-area";
import {EditableAreaInterface} from "./stage/structural/editable-area.d";

/**
 * Build the stage with the provided value
 *
 * @param {stage} stage
 * @param {string} value
 * @returns {Promise<void>}
 */
function buildFromContent(stage: Stage, value: string) {
    const stageDocument = document.createElement("div");
    stageDocument.setAttribute(Config.getValueAsString("dataRoleAttributeName"), "stage");
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
        && element.getAttribute(Config.getValueAsString("dataRoleAttributeName"))
    ) {
        const childPromises: Array<Promise<EditableArea>> = [];
        const childElements: Element[] = [];
        const children = getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: HTMLElement) => {
                childPromises.push(createElementBlock(childElement, stage, stage));
                childElements.push(childElement);
            });
        }

        // Wait for all the promises to finish and add the instances to the stage
        return Promise.all(childPromises).then((childrenPromises) => {
            return Promise.all(childrenPromises.map((child, index) => {
                parent.addChild(child);
                return buildElementIntoStage(childElements[index], child, stage);
            }));
        });
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
function createElementBlock(element: HTMLElement, stage: Stage, parent?: EditableArea): Promise<EditableArea> {
    parent = parent || stage;
    const role = element.getAttribute(Config.getValueAsString("dataRoleAttributeName"));

    return getElementData(element).then(
        (data: object) => createBlock(
            Config.getInitConfig("content_types")[role],
            parent,
            stage,
            data,
        ),
    );
}

/**
 * Retrieve the elements data
 *
 * @param element
 * @returns {{}}
 */
function getElementData(element: HTMLElement) {
    const result = {};
    const attributeReaderComposite = new AttributeReaderComposite();
    const readPromise = attributeReaderComposite.read(element);
    return readPromise.then((data) => {
        return _.extend(result, data);
    });
}

/**
 * Return elements children, search for direct descendants, or traverse through to find deeper children
 *
 * @param element
 * @returns {Array}
 */
function getElementChildren(element: Element) {
    if (element.hasChildNodes()) {
        let children: any[] = [];
        // Find direct children of the element
        _.forEach(element.childNodes, (child: HTMLElement) => {
            // Only search elements which tagName's and not script tags
            if (child.tagName && child.tagName !== "SCRIPT") {
                if (child.hasAttribute(Config.getValueAsString("dataRoleAttributeName"))) {
                    children.push(child);
                } else {
                    children = getElementChildren(child);
                }
            }
        });

        return children;
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

function buildEmpty(stage: Stage, initialValue: string) {
    const stageConfig = Config.getInitConfig("stage_config");
    const rootContentTypeConfig = Config.getContentType(stageConfig.root_content_type);
    const htmlDisplayContentTypeConfig = Config.getContentType(stageConfig.html_display_content_type);

    if (rootContentTypeConfig) {
        return createBlock(rootContentTypeConfig, stage, stage, {}).then((row: Block) => {
            stage.addChild(row);
            if (htmlDisplayContentTypeConfig && initialValue) {
                return createBlock(
                    htmlDisplayContentTypeConfig,
                    stage,
                    stage,
                    {
                        html: initialValue,
                    },
                ).then((text: Block) => {
                    row.addChild(text);
                });
            }
        });
    }

    return Promise.resolve();
}

/**
 * Build a stage with the provided parent, content observable and initial value
 *
 * @param parent
 * @param panel
 * @param {KnockoutObservableArray<Structural>} stageContent
 * @param {string} content
 * @param {function} afterCreateCallback
 * @returns {Stage}
 */
export default function build(
    parent: any,
    panel: Panel,
    stageContent: KnockoutObservableArray<Structural>,
    content: string,
    afterCreateCallback: (stage: Stage) => void,
) {
    // Create a new instance of the stage
    const stage: Stage = new Stage(
        parent,
        stageContent,
    );

    if (typeof afterCreateCallback !== "undefined") {
        afterCreateCallback(stage);
    }

    let currentBuild;

    // Bind the panel to the stage
    panel.bindStage(stage);

    // Determine if we're building from existing page builder content
    if (validateFormat(content)) {
        currentBuild = buildFromContent(stage, content)
            .catch((e) => {
                stageContent([]);
                currentBuild = buildEmpty(stage, content);
            });
    } else {
        currentBuild = buildEmpty(stage, content);
    }

    // Once the build process is finished the stage is ready
    currentBuild.then(stage.ready.bind(stage))
        .catch((error: Error) => {
            parent.alertDialog({
                content: $t("An error has occurred while initiating the content area."),
                title: $t("Advanced CMS Error"),
            });
            stage.emit("stageError", error);
            console.error( error );
        });
    return stage;
}
