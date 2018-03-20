/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class BackgroundRepeat implements ElementConverterInterface {

    public fromDom(value: string): string | object {
        return value === "repeat" ? "1" : "0";
    }

    public toDom(name: string, data: object): string | object {
        return data[name] === "1" ? "repeat" : "no-repeat";
    }
}