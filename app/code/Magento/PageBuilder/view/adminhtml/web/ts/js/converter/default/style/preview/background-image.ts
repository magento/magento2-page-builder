/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../../element-converter-interface";

export default class BackgroundImage implements ElementConverterInterface {

    public fromDom(value: string): string | object {
        return value;
    }

    public toDom(name: string, data: object): string | object {
        const value = data[name];
        if (value && typeof value[0] === "object") {
            return "url(" + value[0].url + ")";
        }
        return null;
    }
}