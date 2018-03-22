/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface PropertyReaderInterface {
    /**
     * Read element data
     *
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    read(element: HTMLElement): string | object;
}
