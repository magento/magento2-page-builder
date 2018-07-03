/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class BorderWidth implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value === "initial" ? "" : value.replace("px", "");
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        if (data[name]) {
            return data[name] + "px";
        }
    }
}
