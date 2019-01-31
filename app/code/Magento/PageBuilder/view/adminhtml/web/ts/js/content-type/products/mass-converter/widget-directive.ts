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
        };

        data.conditions_encoded = this.decodeWysiwygCharacters(attributes.conditions_encoded || "");
        data.products_count = attributes.products_count;
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
            type_name: "Catalog Products List",
            conditions_encoded: this.encodeWysiwygCharacters(data.conditions_encoded || ""),
        };

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
}
