/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import ConverterInterface from "../converter-interface";

export default class Encode implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value.replace(/&amp;lt;/g, "<").replace(/&amp;gt;/g, ">");
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        return data[name].toString().replace(/</g, "&amp;lt;").replace(/>/g, "&amp;gt;");
    }
}
