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

        const link = data[name];
        let href = "";

        if (!link) {
            return href;
        }

        const linkType = link.type;
        const isHrefId = !isNaN(parseInt(link[linkType], 10));

        if (isHrefId && link) {
            href = this.convertToWidget(link[linkType], this.widgetParamsByLinkType[linkType]);
        } else if (link[linkType]) {
            href = link[linkType];
        }
        return href;
    }

    /**
     * @param {string} href
     * @param {object} widgetAttributes
     * @returns {string}
     */
    private convertToWidget(href: string, widgetAttributes: object): string {
        const attributesString = _.map(
            widgetAttributes,
            (val: string, key: string) => `${key}='${val.replace(":href", href)}'`,
        ).join(" ");

        return `{{widget ${attributesString} }}`;
    }

}
