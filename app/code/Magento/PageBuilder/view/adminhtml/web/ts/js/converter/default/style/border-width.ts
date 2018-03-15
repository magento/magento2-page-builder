/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class BorderWidth implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return value === "initial" ? "" : value.replace("px", "");
    }

    public toDom(value: string, key: string, data: object): string | object {
        return value + "px";
    }
}