/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";

export class PropertyReaderPool {
    private propertyReaders: {
        [key: string]: PropertyReaderInterface;
    } = {};

    /**
     * Retrieve a property reader from the pool
     *
     * @param {string} name
     * @returns {PropertyReaderInterface}
     */
    public get(name: string): PropertyReaderInterface {
        return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : null;
    }

    /**
     * Register a new property reader into the pool
     *
     * @param {string} name
     * @param {PropertyReaderInterface} property
     */
    public register(name: string, property: PropertyReaderInterface) {
        this.propertyReaders[name] = property;
    }
}

export default new PropertyReaderPool();
