/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {DataObjectMargins} from "../../../../property/margins";

export default class Margins implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: DataObjectMargins): DataObjectMargins {
        if (undefined !== value.margin) {
            return {
                margin: {
                    top: value.margin.top.replace("px", ""),
                    left: value.margin.left.replace("px", ""),
                    right: value.margin.right.replace("px", ""),
                    bottom: value.margin.bottom.replace("px", ""),
                },
            };
        }
        return {};
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
        let value: DataObjectMargins;
        if (data[name] && typeof data[name] === "string") {
            value = JSON.parse(data[name]);
        } else {
            value = data[name];
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
