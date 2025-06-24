/**
 * Copyright 2020 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class MinHeight implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): object | string {
        return value.indexOf("calc") !== -1 ? value.substring(5, value.length - 1) : value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string {
        const value = get<string>(data, name);
        // We need to check that value is not undefined at this point to avoid split to crash if the key does not exist
        if (value === undefined) {
            return '';
        }

        return value.split(/\+|\-|\*|\//).length > 1 ? `calc(${get(data, name)})` : value;
    }
}
