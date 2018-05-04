/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import mageUtils from "mageUtils";
import appearanceConfig from "../../content-type/appearance-config";
import {fromSnakeToCamelCase} from "../../utils/string";
import DataConverterPool from "../../converter/data-converter-pool";
import dataConverterPoolFactory from "../../converter/data-converter-pool-factory";
import PropertyReaderPool from "../../converter/element-converter-pool";
import ElementConverterPool from "../../converter/element-converter-pool";
import elementConverterPoolFactory from "../../converter/element-converter-pool-factory";
import propertyReaderPoolFactory from "../../property/property-reader-pool-factory";
import ReadInterface from "../read-interface";

export default class Configurable implements ReadInterface {

    /**
     * Read data from the dom based on configuration
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const role = element.getAttribute("data-role");
        const config = appearanceConfig(role, element.getAttribute("data-appearance")).data_mapping;
        const componentsPromise: Array<Promise<any>> = [
            propertyReaderPoolFactory(role),
            elementConverterPoolFactory(role),
            dataConverterPoolFactory(role),
        ];
        return new Promise((resolve: (data: object) => void) => {
            Promise.all(componentsPromise).then((loadedComponents) => {
                const [propertyReaderPool, elementConverterPool, dataConverterPool] = loadedComponents;
                let data = {};
                for (const elementName of Object.keys(config.elements)) {
                    const elementConfig = config.elements[elementName];
                    const xpathResult = document.evaluate(
                        elementConfig.path,
                        element,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null,
                    );
                    const currentElement = xpathResult.singleNodeValue;
                    if (currentElement === null || currentElement === undefined) {
                        continue;
                    }
                    if (elementConfig.style.length) {
                        data = this.readStyle(
                            elementConfig.style,
                            currentElement,
                            data,
                            propertyReaderPool,
                            elementConverterPool,
                        );
                    }
                    if (elementConfig.attributes.length) {
                        data = this.readAttributes(
                            elementConfig.attributes,
                            currentElement,
                            data,
                            propertyReaderPool,
                            elementConverterPool,
                        );
                    }
                    if (undefined !== elementConfig.html.var) {
                        data = this.readHtml(elementConfig, currentElement, data, elementConverterPool);
                    }
                    if (undefined !== elementConfig.tag.var) {
                        data = this.readHtmlTag(elementConfig, currentElement, data);
                    }
                    if (undefined !== elementConfig.css.var) {
                        data = this.readCss(elementConfig, currentElement, data);
                    }
                }
                data = this.convertData(config, data, dataConverterPool);
                resolve(data);
            }).catch((error) => {
                console.error(error);
            });
        });
    }

    /**
     * Read attributes for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {PropertyReaderPool} propertyReaderPool
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */
    private readAttributes(
        config: object,
        element: Node,
        data: object,
        propertyReaderPool: PropertyReaderPool,
        elementConverterPool: ElementConverterPool,
    ) {
        const result = {};
        for (const attributeConfig of config) {
            if (true === !!attributeConfig.virtual) {
                continue;
            }
            let value = !!attributeConfig.complex
                ? propertyReaderPool.get(attributeConfig.reader).read(element)
                : element.getAttribute(attributeConfig.name);
            if (elementConverterPool.get(attributeConfig.converter)) {
                value = elementConverterPool.get(attributeConfig.converter).fromDom(value);
            }
            if (data[attributeConfig.var] === "object") {
                value = mageUtils.extend(value, data[attributeConfig.var]);
            }
            result[attributeConfig.var] = value;
        }
        return _.extend(data, result);
    }

    /**
     * Read style properties for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {PropertyReaderPool} propertyReaderPool
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */
    private readStyle(
        config: object,
        element,
        data: object,
        propertyReaderPool: PropertyReaderPool,
        elementConverterPool: ElementConverterPool,
    ) {
        const result: object = _.extend({}, data);
        for (const propertyConfig of config) {
            if (true === !!propertyConfig.virtual) {
                continue;
            }
            let value = !!propertyConfig.complex
                ? propertyReaderPool.get(propertyConfig.reader).read(element)
                : element.style[fromSnakeToCamelCase(propertyConfig.name)];
            if (elementConverterPool.get(propertyConfig.converter)) {
                value = elementConverterPool.get(propertyConfig.converter).fromDom(value);
            }
            if (typeof result[propertyConfig.var] === "object") {
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
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */
    private readHtmlTag(config: any, element: Node, data: object) {
        const result = {};
        result[config.tag.var] = element.nodeName.toLowerCase();
        return _.extend(data, result);
    }

    /**
     * Read element's css
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */
    private readCss(config: any, element: Node, data: object) {
        const result = {};
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
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */
    private readHtml(config: any, element: Node, data: object, elementConverterPool: ElementConverterPool) {
        const result = {};
        let value = element.innerHTML;

        if (elementConverterPool.get(config.html.converter)) {
            value = elementConverterPool.get(config.html.converter).fromDom(value);
        }

        result[config.html.var] = value;
        return _.extend(data, result);
    }

    /**
     * Convert data after it's read for all elements
     *
     * @param {object} config
     * @param {object} data
     * @param {DataConverterPool} dataConverterPool
     * @returns {object}
     */
    private convertData(config: any, data: object, dataConverterPool: DataConverterPool) {
        for (const converterConfig of config.converters) {
            if (dataConverterPool.get(converterConfig.component)) {
                data = dataConverterPool.get(converterConfig.component).fromDom(
                    data,
                    converterConfig.config,
                );
            }
        }
        return data;
    }
}
