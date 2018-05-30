/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ConverterInterface} from "../../../../converter/converter-interface";

export default class MapMarkers implements ConverterInterface {

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value !== "{}" ? JSON.parse(value) : "";
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    public toDom(name: string, data: object): string {
        let result = "{}";
        if (typeof data[name] === "object") {
            data[name].lat = parseFloat(data[name].lat);
            data[name].lng = parseFloat(data[name].lng);
            result = JSON.stringify(data[name]);
        }

        return result;
    }
}
