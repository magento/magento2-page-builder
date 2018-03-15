/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class MarginsAndPaddings implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        const [type, direction] = key.split('_');
        const result = {};
        result[type] = {};
        result[type][direction] = value.replace('px', '');
        return result;
    }

    public toDom(value: string, key: string, data: object): string | object {
        const parts = key.split("_");
        if (typeof value === "string" && value !== "") {
            value = JSON.parse(value);
        }
        return value !== undefined
        && value[parts[0]] !== undefined
        && value[parts[0]][parts[1]] !== undefined
            ? value[parts[0]][parts[1]] + "px"
            : null;
    }
}