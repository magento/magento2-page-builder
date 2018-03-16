/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../config";
import ElementConverterPool from "../../block/element-converter-pool";
import ConverterPool from "../../block/converter-pool";
import elementConverterPoolFactory from "../../block/element-converter-pool-factory";
import converterPoolFactory from "../../block/converter-pool-factory";
import {fromSnakeToCamelCase} from "../../../utils/string";
import {objectExtend} from "../../../utils/array";
import appearanceConfig from "../../../component/block/appearance-config";

export default class Configurable implements ReadInterface {

    /**
     * Read data from the dom based on configuration
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const role = element.getAttribute('data-role');
        const config = appearanceConfig(role, element.getAttribute("data-appearance")).data_mapping;
        const mappersLoaded: Array<Promise<any>> = [elementConverterPoolFactory(role), converterPoolFactory(role)];
        return new Promise((resolve: (data: object) => void) => {
            Promise.all(mappersLoaded).then((loadedMappers) => {
                const [elementConverterPool, converterPool] = loadedMappers;
                let data = {};
                for (let elementName: string in config.elements) {
                    let xpathResult = document.evaluate(
                        config.elements[elementName].path,
                        element,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
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
                            elementConverterPool
                        );
                    }
                    if (config.elements[elementName].attributes !== undefined) {
                        data = this.readAttributes(
                            config.elements[elementName].attributes,
                            currentElement,
                            data,
                            elementConverterPool
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
                data = this.convertData(config, data, converterPool);
                resolve(data);
            }).catch((error) => {
                console.error(error);
            });
        });
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
     * Read attributes for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */
    private readAttributes(config: any, element: Node, data: object, elementConverterPool: ElementConverterPool) {
        const result = {};
        for (let i = 0; i < config.length; i++) {
            let attribute = config[i];
            let value = element.getAttribute(attribute.name);
            const mapper = attribute.var + attribute.name;
            if (mapper in elementConverterPool.getAttributeConverters()) {
                value = elementConverterPool.getAttributeConverters()[mapper].fromDom(value);
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
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */
    private readStyle(config: any, element, data: object, elementConverterPool: ElementConverterPool) {
        const result: object = _.extend({}, data);
        for (let i = 0; i < config.length; i++) {
            let property = config[i];
            if (true === !!property.virtual) {
                continue;
            }
            let value = element.style[fromSnakeToCamelCase(property.name)];
            const mapper = property.var + property.name;
            if (mapper in elementConverterPool.getStyleConverters()) {
                value = elementConverterPool.getStyleConverters()[mapper].fromDom(value, property.name);
            }
            if (typeof result[property.var] === "object") {
                value = objectExtend(result[property.var], value);
            }
            result[property.var] = value;
        }
        return result;
    }

    /**
     * Convert data after it's read for all elements
     *
     * @param {object} config
     * @param {object} data
     * @param {ConverterPool} converterPool
     * @returns {object}
     */
    private convertData(config: any, data: object, converterPool: ConverterPool) {
        for (let key in converterPool.getConverters()) {
            for (let i = 0; i < config.converters.length; i++) {
                if (config.converters[i].name === key) {
                    data = converterPool.getConverters()[key].afterRead(data, config.converters[i].config);
                }
            }
        }
        return data;
    }
}
