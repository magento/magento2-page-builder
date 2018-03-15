/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";
import {fromHex} from "../../../utils/color-converter";
import {percentToDecimal} from "../../../utils/number-converter";

export default class OverlayColorTransparency implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }

    public toDom(value: string, key: string, data: object): string | object {
        let overlayColor: string = "transparent";
        if (data.show_overlay !== "never_show") {
            if (data.overlay_color !== "" && data.overlay_color !== undefined) {
                overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
            }
        }
        return overlayColor;
    }
}