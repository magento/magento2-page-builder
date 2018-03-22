/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {toHex} from "../../../utils/color-converter";
import ElementConverterInterface from "../../element-converter-interface";

export default class OverlayColor implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | Object}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "" : toHex(value);
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | Object}
     */
    public toDom(name: string, data: object): string | object {
        return data[name];
    }
}
