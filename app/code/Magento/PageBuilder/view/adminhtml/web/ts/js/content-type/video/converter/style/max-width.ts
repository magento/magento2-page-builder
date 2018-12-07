/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";

/**
 * Subtract margin from max-width to fit inside parent container
 * Accepted values are in pixels. If no value is set by user, it's 100%
 *
 * @api
 */
export default class MaxWidth implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): object | string {
        if (value.indexOf("100%") !== -1) {
            return "";
        }
        return value.replace("px", "");
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string {
        if (data[name] !== "") {
            return data[name] + "px";
        }
        if (data.margins_and_padding && data.margins_and_padding !== undefined) {
            const margins = data.margins_and_padding.margin || {};
            const marginLeft = margins.left ? parseInt(margins.left as string, 10) : 0;
            const marginRight = margins.right ? parseInt(margins.right as string, 10) : 0;

            return "calc(100% - " + (marginLeft + marginRight) + "px)";
        }
        return "100%";
    }
}
