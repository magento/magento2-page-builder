/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import {fromHex} from "../../../utils/color-converter";
import {percentToDecimal} from "../../../utils/number-converter";

export default class OverlayBackgroundColor implements ElementConverterInterface {

    public fromDom(value: string): string | object {
        return value;
    }

    public toDom(name: string, data: object): string | object {
        let overlayColor: string = "transparent";
        if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
            overlayColor = fromHex(data.overlay_color, percentToDecimal(data.overlay_transparency));
        }
        return overlayColor;
    }
}