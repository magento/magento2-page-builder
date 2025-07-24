/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import {DataObject} from "../data-store";

/**
 * @api
 */
interface ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {any} value
     * @returns {any}
     */
    fromDom(value: any): any;

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {any}
     */
    toDom(name: string, data: DataObject): any;
}

export default ConverterInterface;
