/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

class ConverterPool {
    private converters: object = {};

    public get(name: string) {
        return this.converters[name] !== undefined ? this.converters[name] : false;
    }

    public register(name: string, converter: object) {
        this.converters[name] = converter;
    }
}

export default new ConverterPool();
