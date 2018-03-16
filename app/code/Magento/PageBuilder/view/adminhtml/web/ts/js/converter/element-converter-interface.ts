/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface ElementConverterInterface {
    /**
     * Convert value to internal representation format
     *
     * @param value string
     * @param key string
     * @param data object
     * @returns {string | object}
     */
    fromDom(value: string, key: string, data: object): string | object;

    /**
     * Convert value to format that will be used when saving to dom
     *
     * @param value string
     * @param key string
     * @param data object
     * @returns {string | object}
     */
    toDom(value: string, key: string, data: object): string | object;
}

export default ElementConverterInterface;
