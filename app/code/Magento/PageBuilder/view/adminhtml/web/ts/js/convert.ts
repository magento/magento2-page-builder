/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import DataConverterPool from "./component/block/data-converter-pool";
import ElementConverterPool from "./component/block/element-converter-pool";
import {DataObject} from "./component/data-store";
import ContentTypeInterface from "./content-type.d";
import {fromSnakeToCamelCase} from "./utils/string";
import appearanceConfig from "./component/block/appearance-config";

export default class Convert {
    private elementConverterPool: ElementConverterPool;
    private dataConverterPool: DataConverterPool;

    /**
     * @param elementConverterPool
     * @param dataConverterPool
     */
    constructor(
        elementConverterPool: ElementConverterPool,
        dataConverterPool: DataConverterPool,
    ) {
        this.elementConverterPool = elementConverterPool;
        this.dataConverterPool = dataConverterPool;
    }

    /**
     * Update preview observables after data changed in data store
     *
     * @param {object} data
     */
    public updatePreviewObservables(viewModel, data: object, area: string) {
        const appearance = data && data.appearance !== undefined ? data.appearance : undefined;
        const appearanceConfiguration = appearanceConfig(viewModel.parent.config.name, appearance);
        if (undefined === appearanceConfiguration
            || undefined === appearanceConfiguration.data_mapping
            || undefined === appearanceConfiguration.data_mapping.elements
        ) {
            return;
        }

        const config = appearanceConfiguration.data_mapping.elements;

        for (const elementName of Object.keys(config)) {
            if (viewModel.data[elementName] === undefined) {
                viewModel.data[elementName] = {
                    attributes: ko.observable({}),
                    style: ko.observable({}),
                    css: ko.observable({}),
                    html: ko.observable({}),
                };
            }

            data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

            if (config[elementName].style !== undefined) {
                viewModel.data[elementName].style(this.convertStyle(config[elementName], data, area));
            }
            if (config[elementName].attributes !== undefined) {
                viewModel.data[elementName].attributes(this.convertAttributes(config[elementName], data, area));
            }
            if (config[elementName].html !== undefined) {
                viewModel.data[elementName].html(this.convertHtml(config[elementName], data, area));
            }
            if (config[elementName].css !== undefined && config[elementName].css.var in data) {
                const css = data[config[elementName].css.var];
                const newClasses = {};

                if (css.length > 0) {
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
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @param {string} area
     * @returns {object}
     */
    public convertAttributes(config: any, data: DataObject, area: string) {
        const result = {};
        for (const attributeConfig of config.attributes) {
            if (undefined !== attributeConfig.persist
                && null !== attributeConfig.persist
                && "false" === attributeConfig.persist
            ) {
                continue;
            }
            let value = data[attributeConfig.var];
            const converter = "preview" === area && attributeConfig.preview_converter
                ? attributeConfig.preview_converter
                : attributeConfig.converter;
            if (this.elementConverterPool.get(converter)) {
                value = this.elementConverterPool.get(converter).toDom(attributeConfig.var, data);
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
     * @param {string} area
     * @returns {object}
     */
    public convertStyle(config: any, data: any, area: string) {
        const result = {};
        if (config.style) {
            for (const propertyConfig of config.style) {
                if (undefined !== propertyConfig.persist
                    && null !== propertyConfig.persist
                    && "false" === propertyConfig.persist
                ) {
                    continue;
                }
                let value = "";
                if (!!propertyConfig.static) {
                    value = propertyConfig.value;
                } else {
                    value = data[propertyConfig.var];
                    const converter = "preview" === area && propertyConfig.preview_converter
                        ? propertyConfig.preview_converter
                        : propertyConfig.converter;
                    if (this.elementConverterPool.get(converter)) {
                        value = this.elementConverterPool.get(converter).toDom(propertyConfig.var, data);
                    }
                }
                if (typeof value === "object") {
                    _.extend(result, value);
                } else {
                    result[fromSnakeToCamelCase(propertyConfig.name)] = value;
                }
            }
        }
        return result;
    }

    /**
     * Convert html property
     *
     * @param {object} config
     * @param {DataObject} data
     * @param {string} area
     * @returns {string}
     */
    public convertHtml(config: any, data: DataObject, area: string) {
        let value = data[config.html.var] || config.html.placeholder;

        const converter = "preview" === area && config.html.preview_converter
            ? config.html.preview_converter
            : config.html.converter;
        if (this.elementConverterPool.get(converter)) {
            value = this.elementConverterPool.get(converter).toDom(config.html.var, data);
        }

        return value;
    }

    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {Object} data
     * @param {Object} convertersConfig
     * @returns {Object}
     */
    public convertData(data: object, convertersConfig: object) {
        for (const converterConfig of convertersConfig) {
            data = this.dataConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
        }
        return data;
    }
}
