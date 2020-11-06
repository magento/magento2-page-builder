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
import ConverterPool from "../../converter/converter-pool";
import converterPoolFactory from "../../converter/converter-pool-factory";
import MassConverterPool from "../../mass-converter/converter-pool";
import massConverterPoolFactory from "../../mass-converter/converter-pool-factory";
import PropertyReaderPool from "../../property/property-reader-pool";
import propertyReaderPoolFactory from "../../property/property-reader-pool-factory";
import {ReadInterface} from "../read-interface";

/**
 * @api
 */
export default class Configurable implements ReadInterface {

    /**
     * Read data from the dom based on configuration
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const role = element.getAttribute(Config.getConfig("dataContentTypeAttributeName"));
        const config = appearanceConfig(role, element.getAttribute("data-appearance"));
        const componentsPromise: Array<Promise<any>> = [
            propertyReaderPoolFactory(role),
            converterPoolFactory(role),
            massConverterPoolFactory(role),
        ];
        return new Promise((resolve: (data: object, viewportData?: object) => void) => {
            Promise.all(componentsPromise).then((loadedComponents) => {
                const [propertyReaderPool, converterPool, massConverterPool] = loadedComponents;
                const viewports = Config.getConfig("viewports");
                const data: {[key: string]: any} = {};

                _.each(viewports, (viewport, name) => data[name] = {});
                for (const elementName of Object.keys(config.elements)) {
                    const elementConfig = config.elements[elementName];
                    const currentElement = this.findElementByName(element, elementName);

                    // If we cannot locate the current element skip trying to read any attributes from it
                    if (currentElement === null || currentElement === undefined) {
                        continue;
                    }
                    _.each(viewports, (viewportObj, viewport: string) => {
                        currentElement.setAttribute("style", currentElement.getAttribute(`data-${viewport}-style`));

                        if (elementConfig.style.length) {
                            data[viewport] = this.readStyle(
                                elementConfig.style,
                                currentElement,
                                data[viewport],
                                propertyReaderPool,
                                converterPool,
                            );
                        }

                        if (elementConfig.attributes.length) {
                            data[viewport] = this.readAttributes(
                                elementConfig.attributes,
                                currentElement,
                                data[viewport],
                                propertyReaderPool,
                                converterPool,
                            );
                        }

                        if (undefined !== elementConfig.html.var) {
                            data[viewport] = this.readHtml(
                                elementConfig,
                                currentElement,
                                data[viewport],
                                converterPool,
                            );
                        }

                        if (undefined !== elementConfig.tag.var) {
                            data[viewport] = this.readHtmlTag(elementConfig, currentElement, data[viewport]);
                        }

                        if (undefined !== elementConfig.css.var) {
                            data[viewport] = this.readCss(elementConfig, currentElement, data[viewport]);
                        }
                    });
                }

                _.each(viewports, (viewportObj, viewport: string) => {
                    data[viewport] = this.convertData(config, data[viewport], massConverterPool);
                });
                resolve(data);
            }).catch((error) => {
                console.error(error);
            });
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
        propertyReaderPool: typeof PropertyReaderPool,
        converterPool: typeof ConverterPool,
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
     * @param {DataMappingStyleInterface[]} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {{[p: string]: string}}
     */
    private readStyle(
        config: DataMappingStyleInterface[],
        element: HTMLElement,
        data: object,
        propertyReaderPool: typeof PropertyReaderPool,
        converterPool: typeof ConverterPool,
    ) {
        const result: {[key: string]: any} = _.extend({}, data);
        for (const propertyConfig of config) {
            if ("write" === propertyConfig.persistence_mode) {
                continue;
            }
            let value = !!propertyConfig.static
                ? propertyConfig.value
                : propertyReaderPool.get(propertyConfig.reader).read(element, propertyConfig.name);
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
     * Read element's css
     *
     * @param {ContentTypeConfigAppearanceElementInterface} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {any}
     */
    private readCss(config: ContentTypeConfigAppearanceElementInterface, element: HTMLElement, data: object) {
        const result: {[key: string]: string} = {};
        let css: string = element.getAttribute("class") !== null
            ? element.getAttribute("class")
            : "";
        if (config.css !== undefined
            && config.css.filter !== undefined
            && config.css.filter.length
        ) {
            for (const filterClass of config.css.filter) {
                css = css.replace(filterClass, "");
            }
        }
        result[config.css.var] = css.replace(/\s{2,}/g, " ").trim();
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
        converterPool: typeof ConverterPool,
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
    private convertData(config: any, data: object, massConverterPool: typeof MassConverterPool) {
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
