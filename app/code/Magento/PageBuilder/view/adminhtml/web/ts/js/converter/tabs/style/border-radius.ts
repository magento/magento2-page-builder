/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class BorderRadius implements ElementConverterInterface {
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
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        let borderRadius: string = "0";
        const radius = parseInt(data.border_radius, 10) || "0";
        const alignment: string = data.navigation_alignment.toLowerCase();
        if (data.border !== "_default") {
            if (alignment === "left") {
                borderRadius = `0px ${radius}px ${radius}px ${radius}px`;
            } else if (alignment === "center") {
                borderRadius = `${radius}px`;
            } else {
                borderRadius = `${radius}px 0px ${radius}px ${radius}px`;
            }
        }
        return borderRadius;
    }
}
