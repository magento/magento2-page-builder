/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConverterConfigInterface, ConverterDataInterface} from "../../../mass-converter/converter-interface";
import BaseWidgetDirective from "../../../mass-converter/widget-directive-abstract";
import {set} from "../../../utils/object";

/**
 * @api
 */
export default class WidgetDirective extends BaseWidgetDirective {
    /**
     * Convert value to internal format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const attributes = super.fromDom(data, config) as {
            conditions_encoded: string;
            products_count: number;
            sort_order: string;
            condition_option: string;
            condition_option_value: string;
        };

        data.products_count = attributes.products_count;
        data.sort_order = attributes.sort_order;
        data.condition_option = attributes.condition_option || "condition";
        data[data.condition_option] = this.decodeWysiwygCharacters(
            this.decodeHtmlCharacters(attributes.condition_option_value || ""),
        );
        data.conditions_encoded = this.decodeWysiwygCharacters(attributes.conditions_encoded || "");
        data[data.condition_option + "_source"] = data.conditions_encoded;
        return data;
    }

    /**
     * Convert value to knockout format
     *
     * @param {object} data
     * @param {object} config
     * @returns {object}
     */
    public toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object {
        const attributes = {
            type: "Magento\\CatalogWidget\\Block\\Product\\ProductsList",
            template: "Magento_CatalogWidget::product/widget/content/grid.phtml",
            anchor_text: "",
            id_path: "",
            show_pager: 0,
            products_count: data.products_count,
            condition_option: data.condition_option,
            condition_option_value: "",
            type_name: "Catalog Products List",
            conditions_encoded: this.encodeWysiwygCharacters(data.conditions_encoded || ""),
        } as { [key: string]: any; };

        if (data.sort_order) {
            attributes.sort_order = data.sort_order;
        }

        if (typeof data[data.condition_option] === "string") {
            attributes.condition_option_value = this.encodeWysiwygCharacters(data[data.condition_option]);
        }

        if (attributes.conditions_encoded.length === 0) {
            return data;
        }

        set(data, config.html_variable, this.buildDirective(attributes));
        return data;
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    private encodeWysiwygCharacters(content: string): string {
        return content.replace(/\{/g, "^[")
            .replace(/\}/g, "^]")
            .replace(/"/g, "`")
            .replace(/\\/g, "|")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /**
     * @param {string} content
     * @returns {string}
     */
    private decodeWysiwygCharacters(content: string): string {
        return content.replace(/\^\[/g, "{")
            .replace(/\^\]/g, "}")
            .replace(/`/g, "\"")
            .replace(/\|/g, "\\")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">");
    }

    /**
     * Decode html special characters
     *
     * @param {string} content
     * @returns {string}
     */
    private decodeHtmlCharacters(content: string) {
        if (content) {
            const htmlDocument = new DOMParser().parseFromString(content, "text/html");

            return htmlDocument.body ? htmlDocument.body.textContent : content;
        }

        return content;
    }
}
