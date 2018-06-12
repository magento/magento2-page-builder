/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";

export default class TextAlign implements ConverterInterface {
    private fromDomMap = {
        "flex-start": "left",
        "center": "center",
        "flex-end": "right",
    };

    private toDomMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end",
    };

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (this.fromDomMap[value]) {
            return this.fromDomMap[value];
        }
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
        if (this.toDomMap[data[name]]) {
            return this.toDomMap[data[name]];
        }

        return data[name];
    }
}
