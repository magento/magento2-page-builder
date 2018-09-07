/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "./converter-interface";

class ConverterPool {
    private converters: {
        [key: string]: ConverterInterface;
    } = {};

    /**
     * Retrieve a converter from the pool
     *
     * @param {string} name
     * @returns {ConverterInterface}
     */
    public get(name: string): ConverterInterface {
        return this.converters[name] !== undefined ? this.converters[name] : null;
    }

    /**
     * Register a new converter into the pool
     *
     * @param {string} name
     * @param {ConverterInterface} converter
     */
    public register(name: string, converter: ConverterInterface) {
        this.converters[name] = converter;
    }
}

export default new ConverterPool();
