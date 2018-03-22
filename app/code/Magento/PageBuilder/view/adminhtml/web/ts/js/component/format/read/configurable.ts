/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import appearanceConfig from "../../../component/block/appearance-config";
import {objectExtend} from "../../../utils/array";
import {fromSnakeToCamelCase} from "../../../utils/string";
import PropertyReaderPool from "../../block/element-converter-pool";
import ElementConverterPool from "../../block/element-converter-pool";
import DataConverterPool from "../../block/data-converter-pool";
import converterPoolFactory from "../../block/element-converter-pool-factory";
import dataConverterPoolFactory from "../../block/data-converter-pool-factory";
import propertyReaderPoolFactory from "../../block/property-reader-pool-factory";
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
            converterPoolFactory(role),
            dataConverterPoolFactory(role),
        ];
        return new Promise((resolve: (data: object) => void) => {
            Promise.all(componentsPromise).then((loadedComponents) => {
                const [propertyReaderPool, elementConverterPool, dataConverterPool] = loadedComponents;
                let data = {};
                for (const elementName: string in config.elements) {
                    const xpathResult = document.evaluate(
                        config.elements[elementName].path,
                        element,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null,
                    );
                    const currentElement = xpathResult.singleNodeValue;
                    if (currentElement === null || currentElement === undefined) {
                        continue;
                    }
                    if (config.elements[elementName].style !== undefined) {
                        data = this.readStyle(
                            config.elements[elementName].style,
                            currentElement,
                            data,
                            propertyReaderPool,
                            elementConverterPool,
                        );
                    }
                    if (config.elements[elementName].attributes !== undefined) {
                        data = this.readAttributes(
                            config.elements[elementName].attributes,
                            currentElement,
                            data,
                            propertyReaderPool,
                            elementConverterPool,
                        );
                    }
                    if (config.elements[elementName].html !== undefined) {
                        data = this.readHtml(config.elements[elementName], currentElement, data);
                    }
                    if (config.elements[elementName].tag !== undefined) {
                        data = this.readHtmlTag(config.elements[elementName], currentElement, data);
                    }
                    if (config.elements[elementName].css !== undefined) {
                        data = this.readCss(config.elements[elementName], currentElement, data);
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
        config: any,
        element: Node,
        data: object,
        propertyReaderPool: PropertyReaderPool,
        elementConverterPool: ElementConverterPool,
    ) {
        const result = {};
        for (let i = 0; i < config.length; i++) {
            const attribute = config[i];
            if (true === !!attribute.virtual) {
                continue;
            }
            let value = !!attribute.complex
                ? propertyReaderPool.get(attribute.reader).read(element)
                : element.getAttribute(attribute.name);
            if (elementConverterPool.get(attribute.converter)) {
                value = elementConverterPool.get(attribute.converter).fromDom(value);
            }
            if (data[attribute.var] === "object") {
                value = objectExtend(value, data[attribute.var]);
            }
            result[attribute.var] = value;
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
        config: any,
        element,
        data: object,
        propertyReaderPool: PropertyReaderPool,
        elementConverterPool: ElementConverterPool,
    ) {
        const result: object = _.extend({}, data);
        for (let i = 0; i < config.length; i++) {
            const property = config[i];
            if (true === !!property.virtual) {
                continue;
            }
            let value = !!property.complex
                ? propertyReaderPool.get(property.reader).read(element)
                : element.style[fromSnakeToCamelCase(property.name)];
            if (elementConverterPool.get(property.converter)) {
                value = elementConverterPool.get(property.converter).fromDom(value);
            }
            if (typeof result[property.var] === "object") {
                value = objectExtend(result[property.var], value);
            }
            result[property.var] = value;
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
    private readHtmlTag(config: any, e: Node, data: object) {
        const result = {};
        result[config.tag.var] = e.nodeName.toLowerCase();
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
            for (let i = 0; i < config.css.filter.length; i++) {
                css = css.replace(data[config.css.filter[i]], "");
            }
        }
        result[config.css.var] = css;
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
    private readHtml(config: any, element: Node, data: object) {
        const result = {};
        result[config.html.var] = element.innerHTML;
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
        for (let i = 0; i < config.converters.length; i++) {
            if (dataConverterPool.get(config.converters[i].component)) {
                data = dataConverterPool.get(config.converters[i].component).fromDom(
                    data,
                    config.converters[i].config,
                );
            }
        }
        return data;
    }
}
