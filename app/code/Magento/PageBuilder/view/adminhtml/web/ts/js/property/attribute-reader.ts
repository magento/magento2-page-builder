/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class AttributeReader implements PropertyReaderInterface {
    /**
     * Read attribute from element
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    public read(element: HTMLElement, source: string): string | object {
        return element.getAttribute(source);
    }
}
