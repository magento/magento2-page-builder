/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../../../data-store";
import ConverterInterface from "../../../../converter/converter-interface";

/**
 * @api
 */
export default class Display implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): boolean {
        return !(value === "none");
    }

    /**
     * Convert value to knockout format, if buttons are displayed they should be inline block
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        if (typeof data[name] !== "undefined" && data[name] === false) {
            return "none";
        }
        return "inline-block";
    }
}
