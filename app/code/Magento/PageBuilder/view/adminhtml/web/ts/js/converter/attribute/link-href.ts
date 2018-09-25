/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import _ from "underscore";
import {DataObject} from "../../data-store";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class CreateValueForHref implements ConverterInterface {
    /**
     * @type object
     */
    private widgetParamsByLinkType: {
        [key: string]: {
            type: string;
            page_id?: string;
            id_path?: string;
            template: string;
            type_name: string;
        };
    } = {
        category: {
            type: "Magento\\Catalog\\Block\\Category\\Widget\\Link",
            id_path: `category/:href`,
            template: "Magento_PageBuilder::widget/link_href.phtml",
            type_name: "Catalog Category Link",
        },
        product: {
            type: "Magento\\Catalog\\Block\\Product\\Widget\\Link",
            id_path: `product/:href`,
            template: "Magento_PageBuilder::widget/link_href.phtml",
            type_name: "Catalog Product Link",
        },
        page: {
            type: "Magento\\Cms\\Block\\Widget\\Page\\Link",
            page_id: `:href`,
            template: "Magento_PageBuilder::widget/link_href.phtml",
            type_name: "CMS Page Link",
        },
    };

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (value === "") {
            value = "javascript:void(0)";
        }

        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        const link = data[name] as any;

        if (typeof link === "undefined" || !link[link.type].length) {
            return "javascript:void(0)";
        }

        let href = link[link.type];

        href = this.convertToWidget(href, link.type);

        return href;
    }

    /**
     * @param {string} href
     * @param {string} linkType
     * @returns {string}
     */
    private convertToWidget(href: string, linkType: string): string {
        if (!href || !this.widgetParamsByLinkType[linkType]) {
            return href;
        }

        const attributesString = _.map(
            this.widgetParamsByLinkType[linkType],
            (val: string, key: string) => `${key}='${val.replace(":href", href)}'`,
        ).join(" ");

        return `{{widget ${attributesString} }}`;
    }
}
