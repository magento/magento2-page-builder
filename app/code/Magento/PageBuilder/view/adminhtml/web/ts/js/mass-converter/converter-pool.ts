/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "./converter-interface";

/**
 * @api
 */
class DataConverterPool {
    private converters: object = {};

    public get(name: string): ConverterInterface {
        return this.converters[name] !== undefined ? this.converters[name] : false;
    }

    public register(name: string, converter: ConverterInterface) {
        this.converters[name] = converter;
    }
}

export default new DataConverterPool();
