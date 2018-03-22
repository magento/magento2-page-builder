/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class Paddings implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        const result = {};
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
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        const result = {};
        let value = data[name];
        if (value && typeof value === "string") {
            value = JSON.parse(value);
        }
        if (value && undefined !== value.padding) {
            result.paddingLeft = value.padding.left + "px";
            result.paddingTop = value.padding.top + "px";
            result.paddingRight = value.padding.right + "px";
            result.paddingBottom = value.padding.bottom + "px";
        }
        return result;
    }
}
