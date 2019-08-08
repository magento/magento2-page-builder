/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
export interface ReadInterface {
    /**
     * Read data from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    read(element: HTMLElement): Promise<any>;
}
