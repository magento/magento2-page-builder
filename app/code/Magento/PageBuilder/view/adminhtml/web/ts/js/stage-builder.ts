/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import alertDialog from "Magento_Ui/js/modal/alert";
import * as _ from "underscore";
import Config from "./config";
import ContentTypeCollection from "./content-type-collection";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface, {ConfigFieldInterface} from "./content-type-config.types";
import createContentType, {FieldDefaultsInterface} from "./content-type-factory";
import ContentTypeInterface from "./content-type.types";
import appearanceConfig from "./content-type/appearance-config";
import validateFormat from "./master-format/validator";
import Stage from "./stage";
import {removeQuotesInMediaDirectives} from "./utils/directives";
import loadReader from "./utils/loader";
import {set} from "./utils/object";
import {DataObject} from "./data-store";

export type BuilderStyles = Record<string, CSSStyleDeclaration[]>;

/**
 * Build the stage with the provided value
 *
 * @param stage
 * @param value
 */
function buildFromContent(stage: Stage, value: string) {
    const stageDocument = new DOMParser().parseFromString(`<body>${value}</body>`, "text/html");
    stageDocument.body.setAttribute(Config.getConfig("dataContentTypeAttributeName"), "stage");
    return buildElementIntoStage(
        stageDocument.body,
        stage.rootContainer,
        stage,
        retrieveStylesFromBlock(stageDocument),
    );
}

/**
 * Retrieve the style blocks from the persisted value
 *
 * @param document
 */
function retrieveStylesFromBlock(document: Document): BuilderStyles {
    const styleBlocks = document.getElementsByTagName("style");
    const styles: BuilderStyles = {};
    if (styleBlocks.length > 0) {
        Array.from(styleBlocks).forEach((styleBlock: HTMLStyleElement) => {
            const cssRules = (styleBlock.sheet as CSSStyleSheet).cssRules;
            Array.from(cssRules).forEach((rule: CSSStyleRule) => {
                const selectors = rule.selectorText.split(",").map((selector) => selector.trim());
                selectors.forEach((selector) => {
                    if (!styles[selector]) {
                        styles[selector] = [];
                    }
                    styles[selector].push(rule.style);
                });
            });
        });
    }
    return styles;
}

/**
 * Build an element and it's children into the stage
 *
 * @param element
 * @param contentType
 * @param stage
 * @param styles
 */
function buildElementIntoStage(
    element: Element,
    contentType: ContentTypeCollectionInterface,
    stage: Stage,
    styles: BuilderStyles,
): Promise<any> {
    if (element instanceof HTMLElement
        && element.getAttribute(Config.getConfig("dataContentTypeAttributeName"))
    ) {
        const childPromises: Array<Promise<ContentTypeInterface | ContentTypeCollectionInterface>> = [];
        const childElements: Element[] = [];
        const children = getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: HTMLElement) => {
                childPromises.push(createElementContentType(childElement, stage, styles, contentType));
                childElements.push(childElement);
            });
        }

        // Wait for all the promises to finish and add the instances to the stage
        return Promise.all(childPromises).then((childrenPromises) => {
            return Promise.all(childrenPromises.map((child: ContentTypeCollectionInterface, index) => {
                contentType.addChild(child);
                // Only render children if the content type implements the collection
                if (child instanceof ContentTypeCollection) {
                    return buildElementIntoStage(childElements[index], child, stage, styles);
                }
            }));
        });
    }
}

/**
 * Parse an element in the structure and build the required element
 *
 * @param element
 * @param stage
 * @param styles
 * @param contentType
 */
function createElementContentType(
    element: HTMLElement,
    stage: Stage,
    styles: BuilderStyles,
    contentType?: ContentTypeCollectionInterface,
) {
    contentType = contentType || stage.rootContainer;
    const role = element.getAttribute(Config.getConfig("dataContentTypeAttributeName"));
    if (!role) {
        return Promise.reject(`Invalid master format: Content type element does not contain
            ${Config.getConfig("dataContentTypeAttributeName")} attribute.`);
    }

    const config = Config.getContentTypeConfig(role);
    if (!config) {
        return Promise.reject(`Unable to load Page Builder configuration for content type "${role}".`);
    }

    return getElementData(element, config, styles).then(
        (data: DataObject) => createContentType(
            config,
            contentType,
            stage.id,
            data,
            getElementChildren(element).length,
        ),
    );
}

/**
 * Retrieve the elements data
 *
 * @param element
 * @param config
 * @param styles
 */
function getElementData(
    element: HTMLElement,
    config: ContentTypeConfigInterface,
    styles: BuilderStyles,
): DataObject {
    // Create an object with all fields for the content type with an empty value
    const result = createInitialElementData(config.fields);

    return new Promise((resolve: (result: object) => void) => {
        const role = element.getAttribute(Config.getConfig("dataContentTypeAttributeName"));
        if (!Config.getConfig("content_types").hasOwnProperty(role)) {
            resolve(result);
        } else {
            const readerComponentName = appearanceConfig(role, element.dataset.appearance).reader;
            loadReader([readerComponentName], (ReaderComponent) => {
                const reader = new ReaderComponent();
                reader.read(element, styles).then((readerData: any) => {
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
                if (child.hasAttribute(Config.getConfig("dataContentTypeAttributeName"))) {
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
    const rootContainer = stage.rootContainer;
    const rootContentTypeConfig = Config.getContentTypeConfig(stageConfig.root_content_type);
    const htmlDisplayContentTypeConfig = Config.getContentTypeConfig(stageConfig.html_display_content_type);

    if (rootContentTypeConfig) {
        return createContentType(rootContentTypeConfig, rootContainer, stage.id)
            .then((rootContentType: ContentTypeCollectionInterface) => {
                if (!rootContentType) {
                    return Promise.reject(`Unable to create initial ${stageConfig.root_content_type} content type ` +
                        ` within stage.`);
                }
                rootContainer.addChild(rootContentType);

                if (htmlDisplayContentTypeConfig && initialValue) {
                    return createContentType(
                        htmlDisplayContentTypeConfig,
                        rootContainer,
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
 * Build a stage with the provided content type, content observable and initial value
 *
 * @param stage
 * @param content
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
                stage.rootContainer.children([]);
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
