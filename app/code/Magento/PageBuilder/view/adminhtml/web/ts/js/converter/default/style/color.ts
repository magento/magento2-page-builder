/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class Color implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        if (value === "default" || value === "initial" || value === "") {
            value = "";
        } else {
            const regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
            const matches = regexp.exec(value);
            if (matches) {
                value = "#"
                    + this.fromIntToHex(parseInt(matches[1], 10))
                    + this.fromIntToHex(parseInt(matches[2], 10))
                    + this.fromIntToHex(parseInt(matches[3], 10));
            }
        }
        return value;
    }

    /**
     * Convert from int to hex
     *
     * @param {number} value
     * @returns {string}
     */
    private fromIntToHex(value: number, key: string, data: object): string | object {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    public toDom(value: string): string {
        return value;
    }
}