/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConverterInterface from "../../../../../converter/converter-interface";
import {DataObject} from "../../../../../data-store";
import {get} from "../../../../../utils/object";

/**
 * @api
 */
export default class Boolean implements ConverterInterface {
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
     * Convert value to knockout format, if buttons are displayed they should be reset to default
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        const value = get(data, name);
        if (!_.isUndefined(value) && value === false) {
            return "none";
        }
        return "";
    }
}
