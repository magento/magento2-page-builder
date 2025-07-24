/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import ConverterInterface from "./converter-interface";

class DataConverterPool {
    private converters: {
        [key: string]: ConverterInterface;
    } = {};

    /**
     * Retrieve a data converter instance from the pool
     *
     * @param {string} name
     * @returns {ConverterInterface}
     */
    public get(name: string): ConverterInterface {
        return this.converters[name] !== undefined ? this.converters[name] : null;
    }

    /**
     * Register a new data converter into the pool
     *
     * @param {string} name
     * @param {ConverterInterface} converter
     */
    public register(name: string, converter: ConverterInterface) {
        this.converters[name] = converter;
    }
}

export default new DataConverterPool();
