/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../element-converter-interface";
import {convertMediaDirectivesToUrls, removeQuotesInMediaDirectives} from "../../utils/directives";

export default class Directives implements ElementConverterInterface {
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
    public toDom(name: string, data: object): string {
        return convertMediaDirectivesToUrls(removeQuotesInMediaDirectives(data[name]));
    }
}
