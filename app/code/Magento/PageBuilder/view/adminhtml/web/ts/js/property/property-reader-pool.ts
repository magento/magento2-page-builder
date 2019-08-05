/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface.types";

export class PropertyReaderPool<Reader = PropertyReaderInterface> {
    private propertyReaders: {
        [key: string]: Reader;
    } = {};

    /**
     * Retrieve a property reader from the pool
     *
     * @param {string} name
     * @returns {PropertyReaderInterface}
     */
    public get(name: string): Reader {
        return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : null;
    }

    /**
     * Register a new property reader into the pool
     *
     * @param {string} name
     * @param {PropertyReaderInterface} property
     */
    public register(name: string, property: Reader) {
        this.propertyReaders[name] = property;
    }
}

export default new PropertyReaderPool();
