/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

  export default interface ReadInterface {
    /**
     * Read data from the element
     *
     * @param element HTMLElement
     * @returns {DataObject | Promise<any>}
     */
    read(element: HTMLElement): object | Promise<any>;
}