/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface ConverterInterface {
    /**
     * @param data object
     * @param config object
     * @returns {object}
     */
    afterRead(data: object, config: object): object;

    /**
     * @param data object
     * @param config object
     * @returns {object}
     */
    beforeWrite(data: object, config: object): object;
}
