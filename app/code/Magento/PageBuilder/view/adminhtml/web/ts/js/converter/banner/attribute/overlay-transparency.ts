/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";
import ElementConverterInterface from "../../element-converter-interface";

export default class OverlayTransparency implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | Object}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
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
