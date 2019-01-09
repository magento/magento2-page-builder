/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

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
     * Convert value to knockout format, we only provide a none property if we intend for the content type to be hidden,
     * otherwise we let the original display property handle the display of the content type.
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
        return;
    }
}
