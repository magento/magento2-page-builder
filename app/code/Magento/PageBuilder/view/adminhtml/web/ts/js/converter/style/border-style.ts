/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class BorderStyleDefault implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (!value) {
            return "_default";
        }
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        const value = get<string>(data, name);
        if (value && value !== "_default") {
            return value;
        }
    }
}
