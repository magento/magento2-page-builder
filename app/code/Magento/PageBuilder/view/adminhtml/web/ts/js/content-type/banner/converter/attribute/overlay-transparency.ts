/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import extractAlphaFromRgba from "../../../../utils/extract-alpha-from-rgba";
import {DataObject} from "../../../../data-store";

export default class OverlayTransparency implements ConverterInterface {
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
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string | object {
        return data[name].toString();
    }
}
