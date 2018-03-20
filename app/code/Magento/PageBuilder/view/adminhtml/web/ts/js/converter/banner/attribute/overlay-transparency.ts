/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import extractAlphaFromRgba from "../../../utils/extract-alpha-from-rgba";

export default class OverlayTransparency implements ElementConverterInterface {

    public fromDom(value: string): string | object {
        return value === "transparent" ? "0" : extractAlphaFromRgba(value);
    }

    public toDom(name: string, data: object): string | object {
        return data[name];
    }
}