/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Block from "./block";

export default class ButtonItem extends Block {

    /**
     * Get the attributes for link
     * returns {object}
     */
    public getLinkAttributes(): {} {
        const data = this.getData();

        if (typeof data.button_link === "object") {
            let href = data.button_link[data.button_link.type];

            switch (data.button_link.type) {
                case "category":
                    href = this.convertToCategoryWidget(href);
                    break;
                case "product":
                    href = this.convertToProductWidget(href);
                    break;
                case "page":
                    href = this.convertToPageWidget(href);
                    break;
                case "default":
                    break;
            }

            return {
                data_attribute_link_type: data.button_link.type,
                href,
                target: data.button_link.setting === true ? "_blank" : "",
            };
        } else {
            return {
                data_attribute_link_type: "",
                href: "",
                target: "",
            };
        }
    }

    /**
     * Convert plain href string to category widget string
     *
     * @param {string} href
     * @returns {string}
     */
    private convertToCategoryWidget(href: string): string {
        const attributes = {
            type: "Magento\\Catalog\\Block\\Category\\Widget\\Link",
            id_path: `category/${href}`,
            template: "category/widget/link/link_href.phtml",
            type_name: "Catalog Category Link",
        };

        const attributesString = _.map(attributes, (val, key) => `${key}='${val}'`).join(" ");

        return `{{widget ${attributesString} }}`;
    }

    /**
     * Convert plain href string to product widget string
     *
     * @param {string} href
     * @returns {string}
     */
    private convertToProductWidget(href: string): string {
        const attributes = {
            type: "Magento\\Catalog\\Block\\Product\\Widget\\Link",
            id_path: `product/${href}`,
            template: "category/widget/link/link_href.phtml",
            type_name: "Catalog Product Link",
        };

        const attributesString = _.map(attributes, (val, key) => `${key}='${val}'`).join(" ");

        return `{{widget ${attributesString} }}`;
    }

    /**
     * Convert plain href string to cms page widget string
     *
     * @param {string} href
     * @returns {string}
     */
    private convertToPageWidget(href: string): string {
        const attributes = {
            type: "Magento\\Cms\\Block\\Widget\\Page\\Link",
            page_id: `${href}`,
            template: "category/widget/link/link_href.phtml",
            type_name: "CMS Page Link",
        };

        const attributesString = _.map(attributes, (val, key) => `${key}='${val}'`).join(" ");

        return `{{widget ${attributesString} }}`;
    }
}
