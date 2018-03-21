/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class Margins implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        const result = {};
        if (undefined !== value.margin) {
            result["margin"] = {
                "left": value.margin.left.replace("px", ""),
                "top": value.margin.top.replace("px", ""),
                "right": value.margin.right.replace("px", ""),
                "bottom": value.margin.bottom.replace("px", ""),
            };
        }
        return result;
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data:object): string | object {
        let value = data[name];
        if (typeof value === "string") {
            value = JSON.parse(value);
        }
        const result = {};
        if (undefined !== value && undefined !== value.margin) {
            result["marginLeft"] = value.margin.left + "px";
            result["marginTop"] = value.margin.top + "px";
            result["marginRight"] = value.margin.right + "px";
            result["marginBottom"] = value.margin.bottom + "px";
        }
        return result;
    }
}