/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../../element-converter-interface";

export default class Src implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return;
    }

    public toDom(value: string, key: string, data: object): string | object {
        if (value && typeof value[0] === "object") {
            return value[0].url;
        }
        return null;
    }
}
