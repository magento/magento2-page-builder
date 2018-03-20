/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

class PropertyReaderPool {
    private propertyReaders: object = {};

    public get(name: string) {
        return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : false;
    }

    public register(name: string, property: object) {
        this.propertyReaders[name] = property;
    }
}

export default new PropertyReaderPool();
