/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export default interface PropertyReaderInterface {
    /**
     * Read element data
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    read(element: HTMLElement): string | object;
}
