/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import loadReader from "Magento_PageBuilder/js/utils/loader";
import alertDialog from "Magento_Ui/js/modal/alert";
import * as _ from "underscore";
import Config from "./config";
import ConfigFieldInterface from "./config-field";
import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentTypeConfigInterface from "./content-type-config.d";
import createContentType from "./content-type-factory";
import ContentTypeInterface from "./content-type.d";
import appearanceConfig from "./content-type/appearance-config";
import FieldDefaultsInterface from "./field-defaults";
import validateFormat from "./master-format/validator";
import Stage from "./stage";
import {removeQuotesInMediaDirectives} from "./utils/directives";
import {set} from "./utils/object";

/**
 * Build the stage with the provided value
 *
 * @param {stage} stage
 * @param {string} value
 * @returns {Promise<void>}
 */
function buildFromContent(stage: Stage, value: string) {
    const stageDocument = document.createElement("div");
    stageDocument.setAttribute(Config.getConfig("dataRoleAttributeName"), "stage");
    stageDocument.innerHTML = value;
    return buildElementIntoStage(stageDocument, stage, stage);
}

/**
 * Build an element and it's children into the stage
 *
 * @param {Element} element
 * @param {ContentTypeCollectionInterface} parent
 * @param {stage} stage
 * @returns {Promise<void>}
 */
function buildElementIntoStage(element: Element, parent: ContentTypeCollectionInterface, stage: Stage): Promise<any> {
    if (element instanceof HTMLElement
        && element.getAttribute(Config.getConfig("dataRoleAttributeName"))
    ) {
        const childPromises: Array<Promise<ContentTypeInterface | ContentTypeCollectionInterface>> = [];
        const childElements: Element[] = [];
        const children = getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: HTMLElement) => {
                childPromises.push(createElementContentType(childElement, stage, parent));
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
 * @param {ContentTypeInterface} parent
 * @param {stage} stage
 * @returns {Promise<ContentTypeInterface>}
 */
function createElementContentType(
    element: HTMLElement,
    stage: Stage,
    parent?: ContentTypeInterface,
): Promise<ContentTypeInterface> {
    parent = parent || stage;
    const role = element.getAttribute(Config.getConfig("dataRoleAttributeName"));
    if (!role) {
        return Promise.reject(`Invalid master format: Content type element does not contain
            ${Config.getConfig("dataRoleAttributeName")} attribute.`);
    }

    const config = Config.getContentTypeConfig(role);
    if (!config) {
        return Promise.reject(`Unable to load Page Builder configuration for content type "${role}".`);
    }

    return getElementData(element, config).then(
        (data: object) => createContentType(
            config,
            parent,
            stage.id,
            data,
            getElementChildren(element).length,
        ),
    );
}

/**
 * Retrieve the elements data
 *
 * @param {HTMLElement} element
 * @param {ContentTypeConfigInterface} config
 * @returns {Promise<any>}
 */
function getElementData(element: HTMLElement, config: ContentTypeConfigInterface) {
    // Create an object with all fields for the content type with an empty value
    const result = createInitialElementData(config.fields);

    return new Promise((resolve: (result: object) => void) => {
        const role = element.getAttribute(Config.getConfig("dataRoleAttributeName"));
        if (!Config.getConfig("content_types").hasOwnProperty(role)) {
            resolve(result);
        } else {
            const readerComponents = appearanceConfig(role, element.dataset.appearance).reader;
            loadReader([readerComponents], (...readers: any[]) => {
                const ReaderComponent = readers.pop();
                const reader = new ReaderComponent();
                reader.read(element).then((readerData: any) => {
                    /**
                     * Iterate through the reader data and set the values onto the result array to ensure dot notation
                     * keys are properly handled.
                     */
                    _.each(readerData, (value: any, key: string) => {
                        set(result, key, value);
                    });
                    resolve(result);
                });
            });
        }
    });
}

/**
 * Create the initial object for storing the elements data
 *
 * @param {ConfigFieldInterface} fields
 * @returns {FieldDefaultsInterface}
 */
function createInitialElementData(fields: ConfigFieldInterface): FieldDefaultsInterface {
    return _.mapObject(fields, (field) => {
        if (!_.isUndefined(field.default)) {
            return "";
        } else if (_.isObject(field)) {
            return createInitialElementData(field);
        }
    });
}

/**
 * Return elements children, search for direct descendants, or traverse through to find deeper children
 *
 * @param {HTMLElement} element
 * @returns {Array<HTMLElement>}
 */
function getElementChildren(element: HTMLElement): HTMLElement[] {
    if (element.hasChildNodes()) {
        let children: any[] = [];
        // Find direct children of the element
        _.forEach(element.childNodes, (child: HTMLElement) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.hasAttribute(Config.getConfig("dataRoleAttributeName"))) {
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
    const stageConfig = Config.getConfig("stage_config");
    const rootContentTypeConfig = Config.getContentTypeConfig(stageConfig.root_content_type);
    const htmlDisplayContentTypeConfig = Config.getContentTypeConfig(stageConfig.html_display_content_type);

    if (rootContentTypeConfig) {
        return createContentType(rootContentTypeConfig, stage, stage.id, {})
            .then((rootContentType: ContentTypeCollectionInterface) => {
                if (!rootContentType) {
                    return Promise.reject(`Unable to create initial ${stageConfig.root_content_type} content type ` +
                        ` within stage.`);
                }
                stage.addChild(rootContentType);

                if (htmlDisplayContentTypeConfig && initialValue) {
                    return createContentType(
                        htmlDisplayContentTypeConfig,
                        stage,
                        stage.id,
                        {
                            html: initialValue,
                        },
                    ).then((text: ContentTypeInterface) => {
                        rootContentType.addChild(text);
                    });
                }
            });
    }

    return Promise.resolve();
}

/**
 * Build a stage with the provided parent, content observable and initial value
 *
 * @param {Stage} stage
 * @param {string} content
 * @returns {Promise}
 */
export default function build(
    stage: Stage,
    content: string,
) {
    let currentBuild;

    content = removeQuotesInMediaDirectives(content);
    // Determine if we're building from existing page builder content
    if (validateFormat(content)) {
        currentBuild = buildFromContent(stage, content)
            .catch((error: Error) => {
                console.error(error);
                stage.children([]);
                currentBuild = buildEmpty(stage, content);
            });
    } else {
        currentBuild = buildEmpty(stage, content);
    }

    // Once the build process is finished the stage is ready
    return currentBuild.catch((error: Error) => {
        alertDialog({
            content: $t("An error has occurred while initiating Page Builder. Please consult with your technical " +
                "support contact."),
            title: $t("Page Builder Error"),
        });
        events.trigger("stage:error", error);
        console.error(error);
    });
}
