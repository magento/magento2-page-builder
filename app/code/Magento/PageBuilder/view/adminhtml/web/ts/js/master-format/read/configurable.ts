/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import mageUtils from "mageUtils";
import _ from "underscore";
import Config from "../../config";
import {
    ContentTypeConfigAppearanceElementInterface,
    DataMappingAttributesInterface,
    DataMappingStyleInterface,
} from "../../content-type-config.types";
import appearanceConfig from "../../content-type/appearance-config";
import {generateElementClassName} from "../../content-type/style-registry";
import {ConverterPool} from "../../converter/converter-pool";
import converterPoolFactory from "../../converter/converter-pool-factory";
import {DataObject} from "../../data-store";
import {DataConverterPool} from "../../mass-converter/converter-pool";
import massConverterPoolFactory from "../../mass-converter/converter-pool-factory";
import {PropertyReaderPool} from "../../property/property-reader-pool";
import propertyReaderPoolFactory from "../../property/property-reader-pool-factory";
import StylePropertyReaderInterface from "../../property/style-property-reader-interface.types";
import {BuilderStyles} from "../../stage-builder";
import {ReadInterface} from "../read-interface";

/**
 * @api
 */
export default class Configurable implements ReadInterface {

    /**
     * Read data from the dom based on configuration
     *
     * @param element
     * @param styles
     */
    public read(element: HTMLElement, styles: BuilderStyles): Promise<DataObject> {
        const contentTypeName = element.getAttribute(Config.getConfig("dataContentTypeAttributeName"));
        const config = appearanceConfig(contentTypeName, element.getAttribute("data-appearance"));
        const componentsPromise: [
            Promise<PropertyReaderPool>,
            Promise<ConverterPool>,
            Promise<DataConverterPool>
        ] = [
            propertyReaderPoolFactory(contentTypeName),
            converterPoolFactory(contentTypeName),
            massConverterPoolFactory(contentTypeName),
        ];
        console.log(styles);
        return Promise.all(componentsPromise).then(([propertyReaderPool, converterPool, massConverterPool]) => {
            let data = {};
            for (const elementName of Object.keys(config.elements)) {
                const elementConfig = config.elements[elementName];
                const currentElement = this.findElementByName(element, elementName);

                // If we cannot locate the current element skip trying to read any attributes from it
                if (currentElement === null || currentElement === undefined) {
                    continue;
                }

                if (elementConfig.style.length) {
                    const elementClass = /pb-[a-z]-[a-z]*-[A-Z0-9]{7}/.exec(currentElement.className);
                    if (elementClass) {
                        const elementStyles = styles["." + elementClass.pop()];
                        data = this.readStyle(
                            elementConfig.style,
                            currentElement,
                            data,
                            propertyReaderPool,
                            converterPool,
                            elementStyles,
                        );
                    }
                }

                if (elementConfig.attributes.length) {
                    data = this.readAttributes(
                        elementConfig.attributes,
                        currentElement,
                        data,
                        propertyReaderPool,
                        converterPool,
                    );
                }

                if (undefined !== elementConfig.html.var) {
                    data = this.readHtml(elementConfig, currentElement, data, converterPool);
                }

                if (undefined !== elementConfig.tag.var) {
                    data = this.readHtmlTag(elementConfig, currentElement, data);
                }

                if (undefined !== elementConfig.css.var) {
                    data = this.readCss(elementConfig, currentElement, data, elementName, contentTypeName);
                }
            }

            data = this.convertData(config, data, massConverterPool);
            return data;
        });
    }

    /**
     * Find the element for the current content type by it's name, avoiding searching in other content types by
     * removing any other element which contains it's own data-content-type.
     *
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {HTMLElement}
     */
    private findElementByName(element: HTMLElement, name: string): HTMLElement {
        // Create a clone of the element to avoid modifying the source
        const currentElement = $(element).clone();
        if (currentElement.attr("data-element") === name) {
            return currentElement[0];
        }

        // Attempt to find the element in the children of the data-content-type
        const searchInChildren = currentElement.find(`[data-element="${name}"]`);
        // Ensure the element is within the current content type
        if (searchInChildren.length > 0
            && searchInChildren.closest("[data-content-type]")[0] === currentElement[0]
        ) {
            return searchInChildren[0];
        }

        return null;
    }

    /**
     * Read attributes for element
     *
     * @param {DataMappingAttributesInterface[]} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {any}
     */
    private readAttributes(
        config: DataMappingAttributesInterface[],
        element: HTMLElement,
        data: object,
        propertyReaderPool: PropertyReaderPool,
        converterPool: ConverterPool,
    ) {
        const result: {[key: string]: any} = {};
        for (const attributeConfig of config) {
            if ("write" === attributeConfig.persistence_mode) {
                continue;
            }
            let value = !!attributeConfig.static
                ? attributeConfig.value
                : propertyReaderPool.get(attributeConfig.reader).read(element, attributeConfig.name);
            if (converterPool.get(attributeConfig.converter)) {
                value = converterPool.get(attributeConfig.converter).fromDom(value);
            }
            if ($.type(result[attributeConfig.var]) === "object") {
                value = mageUtils.extend(
                    {[attributeConfig.name]: value},
                    result[attributeConfig.var],
                );
            }
            result[attributeConfig.var] = value;
        }
        return _.extend(data, result);
    }

    /**
     * Read style properties for element
     *
     * @param config
     * @param element
     * @param data
     * @param propertyReaderPool
     * @param converterPool
     * @param styles
     */
    private readStyle(
        config: DataMappingStyleInterface[],
        element: HTMLElement,
        data: object,
        propertyReaderPool: PropertyReaderPool<StylePropertyReaderInterface>,
        converterPool: ConverterPool,
        styles: CSSStyleDeclaration[],
    ) {
        const result: {[key: string]: any} = _.extend({}, data);
        for (const propertyConfig of config) {
            if ("write" === propertyConfig.persistence_mode) {
                continue;
            }
            let value = !!propertyConfig.static
                ? propertyConfig.value
                : propertyReaderPool.get(propertyConfig.reader).read(element, propertyConfig.name, styles);
            if (converterPool.get(propertyConfig.converter)) {
                value = converterPool.get(propertyConfig.converter).fromDom(value);
            }
            if ($.type(result[propertyConfig.var]) === "object") {
                value = mageUtils.extend(result[propertyConfig.var], value);
            }
            result[propertyConfig.var] = value;
        }
        return result;
    }

    /**
     * Read element's tag
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {object}
     */
    private readHtmlTag(config: any, element: HTMLElement, data: object) {
        const result: {[key: string]: string} = {};
        result[config.tag.var] = element.nodeName.toLowerCase();
        return _.extend(data, result);
    }

    /**
     * Read custom CSS classes attached to element
     *
     * @param config
     * @param element
     * @param data
     * @param elementName
     * @param contentTypeName
     */
    private readCss(
        config: ContentTypeConfigAppearanceElementInterface,
        element: HTMLElement,
        data: DataObject,
        elementName: string,
        contentTypeName: string,
    ) {
        const result: {[key: string]: string} = {};
        const css: string = element.getAttribute("class") !== null
            ? element.getAttribute("class")
            : "";
        const systemClass = generateElementClassName(contentTypeName, elementName);
        let ignoredClasses: string[] = [systemClass];
        let classes = css.split(" ").map((className) => className.trim());
        if (config.css !== undefined && config.css.filter !== undefined && config.css.filter.length) {
            ignoredClasses = ignoredClasses.concat(config.css.filter);
        }
        classes = classes.filter((className: string) => {
            return !ignoredClasses.includes(className) && !className.startsWith(systemClass);
        });
        result[config.css.var] = classes.join(" ");
        return _.extend(data, result);
    }

    /**
     * Read element's content
     *
     * @param {ContentTypeConfigAppearanceElementInterface} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof ConverterPool} converterPool
     * @returns {any}
     */
    private readHtml(
        config: ContentTypeConfigAppearanceElementInterface,
        element: HTMLElement,
        data: object,
        converterPool: ConverterPool,
    ) {
        const result: {[key: string]: string} = {};
        let value = element.innerHTML;

        if (converterPool.get(config.html.converter)) {
            value = converterPool.get(config.html.converter).fromDom(value);
        }

        result[config.html.var] = value;
        return _.extend(data, result);
    }

    /**
     * Convert data after it's read for all elements
     *
     * @param config
     * @param {object} data
     * @param {typeof MassConverterPool} massConverterPool
     * @returns {object}
     */
    private convertData(config: any, data: object, massConverterPool: DataConverterPool): DataObject {
        for (const converterConfig of config.converters) {
            if (massConverterPool.get(converterConfig.component)) {
                data = massConverterPool.get(converterConfig.component).fromDom(
                    data,
                    converterConfig.config,
                );
            }
        }
        return data;
    }
}
