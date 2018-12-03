/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {fromHex} from "../../../../utils/color-converter";
import {percentToDecimal} from "../../../../utils/number-converter";

export default class OverlayBackgroundColor implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: DataObject): string | object {
        if (data.show_overlay === "always" && data[name] !== "" && data[name] !== undefined) {
            return data[name].toString();
        }

        return "transparent";
    }
}
