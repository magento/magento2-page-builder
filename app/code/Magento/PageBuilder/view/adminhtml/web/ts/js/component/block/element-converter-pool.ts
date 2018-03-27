/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../converter/element-converter-interface";

class ElementConverterPool {
    private converters: object = {};

    public get(name: string): ElementConverterInterface {
        return this.converters[name] !== undefined ? this.converters[name] : false;
    }

    public register(name: string, converter: ElementConverterInterface) {
        this.converters[name] = converter;
    }
}

export default new ElementConverterPool();
