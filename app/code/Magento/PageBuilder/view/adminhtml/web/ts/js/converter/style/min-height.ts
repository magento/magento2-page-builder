/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";
import RemovePx from "./remove-px";

/**
 * @api
 */
export default class MinHeight extends RemovePx implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): object | string {
        if (value === "100vh") {
            return "";
        }

        return super.fromDom(value);
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string {
        if (get(data, "full_min_height") === "true") {
            return "100vh";
        }
        return super.toDom(name, data);
    }
}
