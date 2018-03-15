/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import {toHex} from "../../../utils/color-converter";

export default class OverlayColor implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return value === "transparent" ? "" : toHex(value);
    }

    public toDom(value: string, key: string, data: object): string {
        return value;
    }
}