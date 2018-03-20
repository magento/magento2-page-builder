/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class Target implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return value === "_blank" ? "1" : "0";
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        return data[name] === "1" ? "_blank" : null;
    }
}