/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import {ConverterInterface} from "../content-type-config.types";
import ConverterPool from "../converter/converter-pool";
import {DataObject} from "../data-store";
import MassConverterPool from "../mass-converter/converter-pool";
import {get} from "../utils/object";
import {fromSnakeToCamelCase} from "../utils/string";
import appearanceConfig from "./appearance-config";
import Master from "./master";
import Preview from "./preview";

export default class ObservableUpdater {
    private converterPool: typeof ConverterPool;
    private massConverterPool: typeof MassConverterPool;
    private converterResolver: (config: object) => string;

    /**
     * @param {typeof ConverterPool} converterPool
     * @param {typeof MassConverterPool} massConverterPool
     * @param {(config: object) => string} converterResolver
     */
    constructor(
        converterPool: typeof ConverterPool,
        massConverterPool: typeof MassConverterPool,
        converterResolver: (config: object) => string,
    ) {
        this.converterPool = converterPool;
        this.massConverterPool = massConverterPool;
        this.converterResolver = converterResolver;
    }

    /**
     * Generate our data.ELEMENT.style Knockout observable objects for use within master and preview formats.
     *
     * @param {Preview} viewModel
     * @param {DataObject} data
     */
    public update(viewModel: Preview | Master, data: DataObject) {
        const appearance = data && data.appearance !== undefined ? data.appearance as string : undefined;
        const appearanceConfiguration = appearanceConfig(viewModel.contentType.config.name, appearance);
        if (undefined === appearanceConfiguration
            || undefined === appearanceConfiguration.elements
        ) {
            return;
        }

        const config = appearanceConfiguration.elements;

        data = this.convertData(data, appearanceConfiguration.converters);

        for (const elementName of Object.keys(config)) {
            if (viewModel.data[elementName] === undefined) {
                viewModel.data[elementName] = {
                    attributes: ko.observable({}),
                    style: ko.observable({}),
                    css: ko.observable({}),
                    html: ko.observable({}),
                };
            }

            if (config[elementName].style !== undefined) {
                const currentStyles = viewModel.data[elementName].style();
                let newStyles = this.convertStyle(config[elementName], data);

                if (currentStyles) {
                    /**
                     * If so we need to retrieve the previous styles applied to this element and create a new object
                     * which forces all of these styles to be "false". Knockout doesn't clean existing styles when
                     * applying new styles to an element. This resolves styles sticking around when they should be
                     * removed.
                     */
                    const removeCurrentStyles = Object.keys(currentStyles)
                        .reduce((object: object, styleName: string) => {
                            return Object.assign(object, {[styleName]: ""});
                        }, {});

                    if (!_.isEmpty(removeCurrentStyles)) {
                        newStyles = _.extend(removeCurrentStyles, newStyles);
                    }
                }

                viewModel.data[elementName].style(newStyles);
            }

            if (config[elementName].attributes !== undefined) {
                const attributeData = this.convertAttributes(config[elementName], data);

                attributeData["data-element"] = elementName;
                viewModel.data[elementName].attributes(attributeData);
            }

            if (config[elementName].html !== undefined) {
                viewModel.data[elementName].html(this.convertHtml(config[elementName], data));
            }

            if (config[elementName].css !== undefined && config[elementName].css.var in data) {
                const css = get<string>(data, config[elementName].css.var);
                const newClasses: {[key: string]: boolean} = {};

                if (css && css.length > 0) {
                    css.toString().split(" ").map(
                        (value: any, index: number) => newClasses[value] = true,
                    );
                }
                for (const className of Object.keys(viewModel.data[elementName].css())) {
                    if (!(className in newClasses)) {
                        newClasses[className] = false;
                    }
                }
                viewModel.data[elementName].css(newClasses);
            }

            if (config[elementName].tag !== undefined) {
                if (viewModel.data[elementName][config[elementName].tag.var] === undefined) {
                    viewModel.data[elementName][config[elementName].tag.var] = ko.observable("");
                }
                viewModel.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
            }
        }
    }

    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {object} data
     * @param {ConverterInterface[]} convertersConfig
     * @returns {object}
     */
    public convertData(data: object, convertersConfig: ConverterInterface[]) {
        for (const converterConfig of convertersConfig) {
            data = this.massConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
        }
        return data;
    }

    /**
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {object}
     */
    private convertAttributes(config: any, data: DataObject) {
        const result: any = {};
        for (const attributeConfig of config.attributes) {
            if ("read" === attributeConfig.persistence_mode) {
                continue;
            }
            let value;
            if (!!attributeConfig.static) {
                value = attributeConfig.value;
            } else {
                value = get(data, attributeConfig.var);
            }
            const converter = this.converterResolver(attributeConfig);
            if (this.converterPool.get(converter)) {
                value = this.converterPool.get(converter).toDom(attributeConfig.var, data);
            }
            result[attributeConfig.name] = value;
        }

        return result;
    }

    /**
     * Convert style properties
     *
     * @param {object}config
     * @param {object}data
     * @returns {object}
     */
    private convertStyle(config: any, data: any) {
        const result: {[key: string]: string} = {};
        if (config.style) {
            for (const propertyConfig of config.style) {
                if ("read" === propertyConfig.persistence_mode) {
                    continue;
                }
                let value: string | object;
                if (!!propertyConfig.static) {
                    value = propertyConfig.value;
                } else {
                    value = get(data, propertyConfig.var);
                    const converter = this.converterResolver(propertyConfig);
                    if (this.converterPool.get(converter)) {
                        value = this.converterPool.get(converter).toDom(propertyConfig.var, data);
                    }
                }
                if (typeof value === "object") {
                    _.extend(result, value);
                } else if (typeof value !== "undefined") {
                    result[fromSnakeToCamelCase(propertyConfig.name)] = value;
                }
            }
        }
        if (_.isEmpty(result)) {
            return null;
        }
        return result;
    }

    /**
     * Convert html property
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {string}
     */
    private convertHtml(config: any, data: DataObject) {
        let value = config.html.var ? get(data, config.html.var, config.html.placeholder) : config.html.placeholder;
        const converter = this.converterResolver(config.html);
        if (this.converterPool.get(converter)) {
            value = this.converterPool.get(converter).toDom(config.html.var, data);
        }
        // if value is empty, use placeholder
        if (typeof value === "string" && !value.length && config.html.placeholder) {
            value = config.html.placeholder;
        }
        return value;
    }
}
