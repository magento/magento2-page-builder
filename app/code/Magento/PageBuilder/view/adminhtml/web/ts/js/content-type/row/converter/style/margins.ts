/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {DataObjectMargins} from "../../../../property/margins";

export default class Margins implements ConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return value;
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
            result.marginBottom = (parseInt(value.margin.bottom, 10) > 0 ? value.margin.bottom : 1) + "px";
        }
        return result;
    }
}
