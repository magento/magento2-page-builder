/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface ElementConverterInterface {
    /**
     * Convert value to internal representation format
     *
     * @param value string
     * @returns {string | object}
     */
    fromDom(value: string): string | object;

    /**
     * Convert value to format that will be used when saving to dom
     *
     * @param name string
     * @param data object
     * @returns {string | object}
     */
    toDom(name: string, data: object): string | object;
}
