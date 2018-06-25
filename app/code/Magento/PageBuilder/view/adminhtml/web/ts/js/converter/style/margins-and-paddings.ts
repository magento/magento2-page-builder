/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class MarginsAndPaddings implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        const result = {};
        if (undefined !== value.margin) {
            result.margin = {
                bottom: value.margin.bottom.replace("px", ""),
                left: value.margin.left.replace("px", ""),
                right: value.margin.right.replace("px", ""),
                top: value.margin.top.replace("px", ""),
            };
        }
        if (undefined !== value.padding) {
            result.padding = {
                bottom: value.padding.bottom.replace("px", ""),
                left: value.padding.left.replace("px", ""),
                right: value.padding.right.replace("px", ""),
                top: value.padding.top.replace("px", ""),
            };
        }
        return result;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        const result = {};
        let value = data[name];
        if (value && typeof value === "string") {
            value = JSON.parse(value);
        }
        if (value) {
            if (undefined !== value.margin) {
                result.marginLeft = value.margin.left + "px";
                result.marginTop = value.margin.top + "px";
                result.marginRight = value.margin.right + "px";
                result.marginBottom = value.margin.bottom + "px";
            }
            if (undefined !== value.padding) {
                result.paddingLeft = value.padding.left + "px";
                result.paddingTop = value.padding.top + "px";
                result.paddingRight = value.padding.right + "px";
                result.paddingBottom = value.padding.bottom + "px";
            }
        }
        return result;
    }
}
