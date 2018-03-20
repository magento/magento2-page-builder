/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class RemovePx implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): object | string {
        return value.replace("px", "");
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): object | string {
        return data[name] + 'px';
    }
}
