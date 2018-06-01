/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConverterInterface from "../converter-interface";

export default class ProductsDirective implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        let attributes: object = {};

        value.replace(/\{\{widget(.*?)\}\}/i, ((match, attributeString) => {
            attributes = this.parseAttributesString(attributeString);
        }).bind(this));

        attributes.conditions_encoded = this.decodeWysiwygCharacters(attributes.conditions_encoded || "");

        return attributes;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    public toDom(name: string, data: object): string {
        const attributes = {
            type: "Magento\\CatalogWidget\\ContentType\\Product\\ProductsList",
            template: "Magento_CatalogWidget::product/widget/content/grid.phtml",
            anchor_text: "",
            id_path: "",
            show_pager: 0,
            products_count: data.products_count,
            type_name: "Catalog Products List",
            conditions_encoded: this.encodeWysiwygCharacters(data.conditions_encoded || ""),
        };

        if (attributes.conditions_encoded.length === 0) {
            return "";
        }

        return "{{widget " + this.createAttributesString(attributes) + "}}";
    }

    /**
     * @param {string} attributes
     * @return {Object}
     */
    private parseAttributesString(attributes: string): object {
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
    private createAttributesString(attributes: object): string {
        let result = "";

        _.each(attributes, (value, name) => {
            result += name + "=\"" + String(value).replace(/"/g, "&quote;") + "\" ";
        });

        return result.substr(0, result.length - 1);
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    private encodeWysiwygCharacters(content: string): string {
        return content.replace(/\{/g, "^[")
            .replace(/\}/g, "^]")
            .replace(/"/g, "`")
            .replace(/\\/g, "|");
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    private decodeWysiwygCharacters(content: string): string {
        return content.replace(/\^\[/g, "{")
            .replace(/\^\]/g, "}")
            .replace(/`/g, "\"")
            .replace(/\|/g, "\\");
    }
}
