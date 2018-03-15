/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";

export default class OverlayTransparency implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }

    public toDom(value: string, key: string, data: object): string | object {
        return value;
    }
}