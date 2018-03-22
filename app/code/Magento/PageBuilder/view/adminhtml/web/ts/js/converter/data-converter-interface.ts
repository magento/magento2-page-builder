/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface DataConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {Object} data
     * @param {Object} config
     * @returns {Object}
     */
    fromDom(data: object, config: object): object;

    /**
     * Process data before it's converted by element converters
     *
     * @param {Object} data
     * @param {Object} config
     * @returns {Object}
     */
    toDom(data: object, config: object): object;
}
