/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {convertMediaDirectivesToUrls} from "../../../utils/directives";
import ElementConverterInterface from "../../element-converter-interface";

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
        return convertMediaDirectivesToUrls(data[name]);
    }
}
