/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class RemovePx implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | Object}
     */
    public fromDom(value: string): object | string {
        return value.replace("px", "");
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | Object}
     */
    public toDom(name: string, data: object): object | string {
        return data[name] + "px";
    }
}
