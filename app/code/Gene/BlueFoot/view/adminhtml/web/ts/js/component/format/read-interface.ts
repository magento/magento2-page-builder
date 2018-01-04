/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/*eslint-disable */
export interface ReadInterface {
    /**
     * Read data from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    read(element: HTMLElement): Promise<any>;
}
