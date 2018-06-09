/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../../../data-store";
import {ConverterInterface} from "../../../../converter/converter-interface";

export default class MaxWidth implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): object | string {
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
        if (!data[name]) {
            return "";
        }
        if (name === "max_width" && !data["max_height"]) {
            return <string>data[name] + "px";
        }
        if (name === "max_height" && !data["max_width"]) {
            // Calculate the max width that would create the max height
            return <string>data["max_height"] / 9 * 16 + "px";
        }
        // The max height won't be met with the supplied width
        if (data["max_width"] / 16 * 9 <= data["max_height"]) {
            return <string>data["max_width"] + "px";
        }
        // Calculate the max width that would create the max height
        return <string>data["max_height"] / 9 * 16 + "px";
    }
}
