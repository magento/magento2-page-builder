/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
interface ConverterInterface {
    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    fromDom(data: ConverterDataInterface, config: ConverterConfigInterface): object;

    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    toDom(data: ConverterDataInterface, config: ConverterConfigInterface): object;
}

export default ConverterInterface;

export interface ConverterDataInterface {
    [key: string]: any;
}

export interface ConverterConfigInterface {
    [key: string]: any;
}
