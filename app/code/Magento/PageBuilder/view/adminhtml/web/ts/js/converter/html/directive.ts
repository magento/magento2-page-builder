/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {convertMediaDirectivesToUrls, removeQuotesInMediaDirectives} from "../../utils/directives";
import {encodeContent} from "../../utils/editor";
import {get} from "../../utils/object";
import ConverterInterface from "../converter-interface";

/**
 * @api
 */
export default class Directives implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        return encodeContent(convertMediaDirectivesToUrls(removeQuotesInMediaDirectives(get(data, name))));
    }
}
