/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../element-converter-interface";

export default class CreateValueForTarget implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    public toDom(name: string, data: object): string {
        if (!data[name]) {
            return "";
        }

        return data[name].setting ? "_blank" : "";
    }
}
