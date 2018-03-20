/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class ButtonOpacity implements ElementConverterInterface {

    public fromDom(value: string): string | object {
        return value;
    }

    public toDom(name: string, data: object): string | object {
        return data.show_button === "always" ? "1" : "0";
    }
}