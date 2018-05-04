/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import DataConverterInterface from "./data-converter-interface";

class DataConverterPool {
    private converters: object = {};

    public get(name: string): DataConverterInterface {
        return this.converters[name] !== undefined ? this.converters[name] : false;
    }

    public register(name: string, converter: DataConverterInterface) {
        this.converters[name] = converter;
    }
}

export default new DataConverterPool();
