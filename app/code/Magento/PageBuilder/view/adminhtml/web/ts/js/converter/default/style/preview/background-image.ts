/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class BackgroundImage implements ElementConverterInterface {

    public toDom(value: string, key: string, data: object): string | object {
        if (value && typeof value[0] === "object") {
            return "url(" + value[0].url + ")";
        }
        return null;
    }
}