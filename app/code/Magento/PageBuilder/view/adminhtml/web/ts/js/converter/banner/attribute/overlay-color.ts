/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {toHex} from "../../../utils/color-converter";
import ElementConverterInterface from "../../element-converter-interface";

export default class OverlayColor implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "" : toHex(value);
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        return data[name];
    }
}
