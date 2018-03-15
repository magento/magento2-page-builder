/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class ConverterPool {
    private converters: object;

    constructor(converters: object) {
        this.converters = converters;
    }

    public getConverters() {
        return this.converters;
    }
}
