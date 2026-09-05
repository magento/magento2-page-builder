/**
 * Copyright 2026 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class LazyLoading implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    public fromDom(value: string): string {
        return "lazy" === value ? "1" : "0";
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data DataObject
     * @returns {string | boolean}
     */
    public toDom(name: string, data: DataObject): string | boolean {
        const value = get<string | number | boolean>(data, name);

        return !value || "0" === value ? false : "lazy";
    }
}
