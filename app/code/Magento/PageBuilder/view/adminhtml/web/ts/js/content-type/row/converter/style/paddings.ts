/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {DataObjectPaddings} from "../../../../property/paddings";
import {get} from "../../../../utils/object";

export default class Paddings implements ConverterInterface {
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
        let value = get<DataObjectPaddings>(data, name);

        if (value && _.isString(value)) {
            value = JSON.parse(value);
        }
        if (value && undefined !== value.padding) {
            result.paddingLeft = value.padding.left ? value.padding.left + "px" : "";
            result.paddingTop = value.padding.top ? value.padding.top + "px" : "";
            result.paddingRight = value.padding.right ? value.padding.right + "px" : "";
            result.paddingBottom = value.padding.bottom ? value.padding.bottom + "px" : "";
        }
        return result;
    }
}
