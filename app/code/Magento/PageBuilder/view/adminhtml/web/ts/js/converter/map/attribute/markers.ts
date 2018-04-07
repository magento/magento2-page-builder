/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ElementConverterInterface} from "../../element-converter-interface";

export default class Markers implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        let content = data[name];
        if (typeof content === "string" && content !== "") {
            content = JSON.parse(content);
        }
        if (content && Object.keys(content).length) {
            const result = {
                lat: content.lat,
                lng: content.lng,
            };
            return JSON.stringify([result]);
        }
        return JSON.stringify([]);
    }
}
