/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

class PropertyPool {
    private properties: object = {};

    public getProperty(name: string) {
        return this.properties[name] !== undefined ? this.properties[name] : false;
    }

    public registerProperty(name: string, property: object) {
        this.properties[name] = property;
    }
}

export default new PropertyPool();
