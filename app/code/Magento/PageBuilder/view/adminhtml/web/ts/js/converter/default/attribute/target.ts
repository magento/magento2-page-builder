/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class Target implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return value === "_blank" ? "1" : "0";
    }

    public toDom(value: string, key: string, data: object): string | object {
        return value === "1" ? "_blank" : null;
    }
}