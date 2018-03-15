/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadComponent from "Magento_PageBuilder/js/component/loader";
import ReadInterface from "../read-interface";
import Config from "../../config";
import elementConverterPoolFactory from "../../block/element-converter-pool-factory";
import converterPoolFactory from "../../block/converter-pool-factory";

export default class Configurable implements ReadInterface {

    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const role = element.getAttribute('data-role');
        const contentTypeConfig = Config.getInitConfig("content_types")[role];

        let config = contentTypeConfig["data_mapping"];

        const appearance = element.getAttribute("data-appearance");

        if (appearance
            && contentTypeConfig["appearances"] !== undefined
            && contentTypeConfig["appearances"][appearance] !== undefined
            && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined
        ) {
            config = contentTypeConfig["appearances"][appearance]["data_mapping"];
        }

        const meppersLoaded: Array<Promise<any>> = [];
        meppersLoaded.push(elementConverterPoolFactory(role));
        meppersLoaded.push(converterPoolFactory(role));

        return new Promise((resolve: (data: object) => void) => {
            Promise.all(meppersLoaded).then((loadedMappers) => {
                const [elementConverterPool, converterPool] = loadedMappers;
                let data = {};
                for (let el in config.elements) {
                    let xpathResult = document.evaluate(
                        config.elements[el].path,
                        element,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    );

                    const e = xpathResult.singleNodeValue;

                    if (e === null || e === undefined) {
                        continue;
                    }

                    if (config.elements[el].style !== undefined) {
                        for (let i = 0; i < config.elements[el].style.length; i++) {
                            let styleProperty = config.elements[el].style[i];
                            if (true === !!styleProperty.virtual) {
                                continue;
                            }
                            let value = e.style[this.fromSnakeToCamelCase(styleProperty.name)];
                            const mapper = styleProperty.var + styleProperty.name;
                            if (mapper in elementConverterPool.getStyleConverters()) {
                                value = elementConverterPool.getStyleConverters()[mapper].fromDom(value, styleProperty.name);
                            }
                            if (typeof data[styleProperty.var] === "object") {
                                value = deepObjectExtend(data[styleProperty.var], value);
                            }
                            data[styleProperty.var] = value;
                        }
                    }

                    if (config.elements[el].attributes !== undefined) {
                        for (let i = 0; i < config.elements[el].attributes.length; i++) {
                            let attribute = config.elements[el].attributes[i];
                            let value = e.getAttribute(attribute.name);
                            const mapper = attribute.var + attribute.name;
                            if (mapper in elementConverterPool.getAttributeConverters()) {
                                value = elementConverterPool.getAttributeConverters()[mapper].fromDom(value);
                            }
                            if (data[attribute.var] === "object") {
                                value = deepObjectExtend(value, data[attribute.var]);
                            }
                            data[attribute.var] = value;
                        }
                    }

                    if (config.elements[el].html !== undefined) {
                        data[config.elements[el].html.var] = e.innerHTML;
                    }

                    if (config.elements[el].tag !== undefined) {
                        data[config.elements[el].tag.var] = e.nodeName.toLowerCase();
                    }

                    if (config.elements[el].css !== undefined) {
                        let css: string = e.getAttribute("class") !== null
                            ? e.getAttribute("class")
                            : "";
                        if (config.elements[el].css !== undefined
                            && config.elements[el].css.filter !== undefined
                            && config.elements[el].css.filter.length
                        ) {
                            for (let i = 0; i < config.elements[el].css.filter.length; i++) {
                                css = css.replace(data[config.elements[el].css.filter[i]], "");
                            }
                        }
                        data[config.elements[el].css.var] = css;
                    }
                }

                for (let key in converterPool.getConverters()) {
                    for (let i = 0; i < config.converters.length; i++) {
                        if (config.converters[i].name === key) {
                            data = converterPool.getConverters()[key].afterRead(data, config.converters[i].config);
                        }
                    }
                }

                console.log(data);

                resolve(data);
            }).catch((error) => {
                console.error( error );
            });
        });
    }

    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */
    private fromSnakeToCamelCase(currentString: string): string {
        const parts: string[] = currentString.split(/[_-]/);
        let newString: string = "";
        for (let i = 1; i < parts.length; i++) {
            newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
        }
        return parts[0] + newString;
    }
}

function deepObjectExtend(target, source) {
    for (let prop in source) {
        if (prop in target) {
            deepObjectExtend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}