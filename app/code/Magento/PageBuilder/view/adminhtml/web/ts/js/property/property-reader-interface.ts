/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
interface PropertyReaderInterface {
    /**
     * Read element data
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    read(element: HTMLElement, source: string): string | object;
}

export default PropertyReaderInterface;
