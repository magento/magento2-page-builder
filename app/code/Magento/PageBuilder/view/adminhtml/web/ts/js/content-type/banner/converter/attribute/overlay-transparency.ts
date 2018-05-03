/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../../../converter/element-converter-interface";
import extractAlphaFromRgba from "../../../../utils/extract-alpha-from-rgba";

export default class OverlayTransparency implements ElementConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        return data[name];
    }
}
