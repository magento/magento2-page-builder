/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";

export default class RemovePx implements ElementConverterInterface {

    public fromDom(value: string): object | string {
        return value.replace("px", "");
    }

    public toDom(name: string, data: object): object | string {
        return data[name] + 'px';
    }
}
