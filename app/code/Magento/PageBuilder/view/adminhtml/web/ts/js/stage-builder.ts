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
import { pbStyleAttribute } from "./content-type/style-registry";
import validateFormat from "./master-format/validator";
import Stage from "./stage";
import {removeQuotesInMediaDirectives} from "./utils/directives";
import loadReader from "./utils/loader";
import {set} from "./utils/object";

/**
 * Build the stage with the provided value
 *
 * @param {stage} stage
 * @param {string} value
 * @returns {Promise<void>}
 */
function buildFromContent(stage: Stage, value: string) {
    const stageDocument = new DOMParser().parseFromString(value, "text/html");
    stageDocument.body.setAttribute(Config.getConfig("dataContentTypeAttributeName"), "stage");
    stageDocument.body.id = Config.getConfig("bodyId");
    convertToInlineStyles(stageDocument);
    return buildElementIntoStage(stageDocument.body, stage.rootContainer, stage);
}

/**
 * Convert styles to block to inline styles.
 *
 * @param document
 */
function convertToInlineStyles(document: Document): void {
    const styleBlocks = document.getElementsByTagName("style");
    const viewportStyles: { [key: string]: any } = {};

    _.each(Config.getConfig("viewports"), (viewport, name: string) => viewportStyles[name] = {});

    if (styleBlocks.length > 0) {
        Array.from(styleBlocks).forEach((styleBlock: HTMLStyleElement) => {
            const cssRules = (styleBlock.sheet as CSSStyleSheet).cssRules;

            processCssRules(cssRules, viewportStyles, Config.getConfig("defaultViewport"));
            styleBlock.remove();
        });
    }

    _.each(viewportStyles, (styles, name: string) => {
        _.each(styles, (stylesArray: CSSStyleDeclaration[], selector: string) => {
            const element: HTMLElement = document.querySelector(selector);

            _.each(stylesArray, (style: CSSStyleDeclaration) => {
                element.setAttribute(
                    `data-${name}-style`,
                    element.getAttribute(`data-${name}-style`) ?
                        element.getAttribute(`data-${name}-style`) + style.cssText :
                        style.cssText,
                );
            });
        });
    });
    document.querySelectorAll(`[${pbStyleAttribute}]`).forEach((element) => {
        element.removeAttribute(pbStyleAttribute);
    });
}

/**
 * Process styles and assign them to corespondent style object.
 *
 * @param cssRules
 * @param styles
 * @param scope
 */
function processCssRules(cssRules: CSSRuleList, styles: { [key: string]: any }, scope: string) {
    Array.from(cssRules).forEach((rule: CSSStyleRule | CSSMediaRule) => {
        if (rule instanceof CSSStyleRule) {
            const selectors = rule.selectorText.split(",").map((selector) => selector.trim());
            selectors.forEach((selector) => {
                if (!styles[scope][selector]) {
                    styles[scope][selector] = [];
                }
                styles[scope][selector].push(rule.style);
            });
        } else if (rule instanceof CSSMediaRule) {
            const mediaCssRules = rule.cssRules;
            const mediaScope = _.findKey(
                Config.getConfig("viewports"),
                (viewport: any) => rule.conditionText === viewport.media,
            );
            if (mediaScope) {
                processCssRules(mediaCssRules, styles, mediaScope);
            }
        }
    });
}

/**
 * Build an element and it's children into the stage
 *
 * @param {Element} element
 * @param {ContentTypeCollectionInterface} contentType
 * @param {stage} stage
 * @returns {Promise<void>}
 */
function buildElementIntoStage(
    element: Element,
    contentType: ContentTypeCollectionInterface,
    stage: Stage,
): Promise<any> {
    if (element instanceof HTMLElement
        && element.getAttribute(Config.getConfig("dataContentTypeAttributeName"))
    ) {
        const childPromises: Array<Promise<ContentTypeInterface | ContentTypeCollectionInterface>> = [];
        const childElements: Element[] = [];
        const children = getElementChildren(element);

        if (children.length > 0) {
            _.forEach(children, (childElement: HTMLElement) => {
                childPromises.push(createElementContentType(childElement, stage, contentType));
                childElements.push(childElement);
            });
        }

        // Wait for all the promises to finish and add the instances to the stage
        return Promise.all(childPromises).then((childrenPromises) => {
            return Promise.all(childrenPromises.map((child: ContentTypeCollectionInterface, index) => {
                contentType.addChild(child);
                // Only render children if the content type implements the collection
                if (child instanceof ContentTypeCollection) {
                    return buildElementIntoStage(childElements[index], child, stage);
                }
            }));
        });
    }
}

/**
 * Parse an element in the structure and build the required element
 *
 * @param {Element} element
 * @param {ContentTypeCollectionInterface} contentType
 * @param {stage} stage
 * @returns {Promise<ContentTypeInterface>}
 */
function createElementContentType(
    element: HTMLElement,
    stage: Stage,
    contentType?: ContentTypeCollectionInterface,
): Promise<ContentTypeInterface> {
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

    return getElementData(element, config).then(
        // @ts-ignore
        (data: any) => createContentType(
            config,
            contentType,
            stage.id,
            data[Config.getConfig("defaultViewport")],
            getElementChildren(element).length,
            data,
        ),
    );
}

/**
 * Retrieve the elements data
 *
 * @param {HTMLElement} element
 * @param {ContentTypeConfigInterface} config
 * @returns {Promise<{[p: string]: any}>}
 */
function getElementData(element: HTMLElement, config: ContentTypeConfigInterface) {
    // Create an object with all fields for the content type with an empty value
    const appearance = element.dataset.appearance + "-appearance";
    const fields = config.fields[appearance] || config.fields.default;
    const result = createInitialElementData(fields);

    return new Promise((resolve: (result: object) => void) => {
        const role = element.getAttribute(Config.getConfig("dataContentTypeAttributeName"));
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
                    _.each(readerData[Config.getConfig("defaultViewport")], (value: any, key: string) => {
                        set(result, key, value);
                    });
                    readerData[Config.getConfig("defaultViewport")] = result;
                    resolve(readerData);
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
        const children: any[] = [];
        // Find direct children of the element
        _.forEach(element.childNodes, (child: HTMLElement) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.hasAttribute(Config.getConfig("dataContentTypeAttributeName"))) {
                    children.push(child);
                } else {
                    children.push(...getElementChildren(child));
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
    // @ts-ignore
    let promise = Promise.resolve() as Promise<ContentTypeInterface | ContentTypeCollectionInterface>;

    if (stageConfig.root_content_type && stageConfig.root_content_type !== "none") {
        promise = createContentType(rootContentTypeConfig, rootContainer, stage.id);
        promise.then((rootContentType: ContentTypeCollectionInterface) => {
            if (!rootContentType) {
                return Promise.reject(`Unable to create initial ${stageConfig.root_content_type} content type ` +
                    ` within stage.`);
            }
            rootContainer.addChild(rootContentType);
        });
    }
    promise.then((rootContentType: ContentTypeCollectionInterface) => {
        if (htmlDisplayContentTypeConfig && initialValue) {
            return createContentType(
                htmlDisplayContentTypeConfig,
                rootContainer,
                stage.id,
                {
                    html: initialValue,
                },
            ).then((html: ContentTypeInterface) => {
                if (rootContentType) {
                    rootContentType.addChild(html);
                } else {
                    rootContainer.addChild(html);
                }
            });
        }
    });

    return promise;
}

/**
 * Build a stage with the provided content type, content observable and initial value
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
