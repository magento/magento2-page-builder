/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import BaseWidgetDirective from "../../../mass-converter/widget-directive-abstract";

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
    public fromDom(data: object, config: object): object {
        const attributes = super.fromDom(data, config);

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
    public toDom(data: object, config: object): object {
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

        data[config.html_variable] = this.buildDirective(attributes);
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
