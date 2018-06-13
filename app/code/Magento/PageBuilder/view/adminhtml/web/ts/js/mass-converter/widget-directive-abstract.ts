/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConverterInterface from "./converter-interface";

export default class WidgetDirectiveAbstract implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: object, config: object): object {
        let attributes: object = {};

        data[config.html_variable].replace(/\{\{widget(.*?)\}\}/i, ((match, attributeString) => {
            attributes = this.parseAttributesString(attributeString);
        }).bind(this));

        return _.extend(data, attributes);
    }

    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: object, config: object): object {
        data[config.html_variable] = this.buildDirective(data);
        return data;
    }

    /**
     * Build the directive string using the supplies attributes
     *
     * @param {object} attributes
     * @returns {string}
     */
    protected buildDirective(attributes: object): string {
        return "{{widget " + this.createAttributesString(attributes) + "}}";
    }

    /**
     * @param {string} attributes
     * @return {Object}
     */
    protected parseAttributesString(attributes: string): object {
        const result = {};

        attributes.replace(
            /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
            (match, key, value) => {
                result[key] = value.replace(/&quote;/g, "\"");
            },
        );

        return result;
    }

    /**
     * @param {Object} attributes
     * @return {string}
     */
    protected createAttributesString(attributes: object): string {
        let result = "";

        _.each(attributes, (value, name) => {
            result += name + "=\"" + String(value).replace(/"/g, "&quote;") + "\" ";
        });

        return result.substr(0, result.length - 1);
    }
}
