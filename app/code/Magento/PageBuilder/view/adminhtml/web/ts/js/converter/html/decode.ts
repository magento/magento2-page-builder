/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {removeQuotesInMediaDirectives} from "../../utils/directives";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class Decode implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        // Convert the encoded string back to HTML without executing
        const html = new DOMParser().parseFromString(value, "text/html");
        return html.body.textContent;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        return removeQuotesInMediaDirectives(get(data, name));
    }
}
