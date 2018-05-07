/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";

class PropertyReaderPool {
    private propertyReaders: object = {};

    public get(name: string): PropertyReaderInterface {
        return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : false;
    }

    public register(name: string, property: PropertyReaderInterface) {
        this.propertyReaders[name] = property;
    }
}

export default new PropertyReaderPool();
