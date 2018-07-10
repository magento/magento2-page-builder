/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";

export default class Margins implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        const result: any = {};
        if (undefined !== value.margin) {
            result.margin = {
                bottom: value.margin.bottom.replace("px", ""),
                left: value.margin.left.replace("px", ""),
                right: value.margin.right.replace("px", ""),
                top: value.margin.top.replace("px", ""),
            };
        }

        return result;
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string | object {
        const result: {
            [key: string]: string;
        } = {};
        let value = data[name];
        if (value && typeof value === "string") {
            value = JSON.parse(value);
        }
        if (value && undefined !== value.margin) {
            result.marginLeft = value.margin.left ? value.margin.left + "px" : "";
            result.marginTop = value.margin.top ? value.margin.top + "px" : "";
            result.marginRight = value.margin.right ? value.margin.right + "px" : "";
            result.marginBottom = value.margin.bottom ? value.margin.bottom + "px" : "";
        }
        return result;
    }
}
