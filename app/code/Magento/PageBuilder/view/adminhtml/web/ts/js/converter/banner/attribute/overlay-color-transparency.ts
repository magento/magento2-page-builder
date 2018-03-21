/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {fromHex} from "../../../utils/color-converter";
import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";
import {percentToDecimal} from "../../../utils/number-converter";
import ElementConverterInterface from "../../element-converter-interface";

export default class OverlayColorTransparency implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        let overlayColor: string = "transparent";
        if (data.show_overlay !== "never_show") {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
            }
        }
        return overlayColor;
    }
}
