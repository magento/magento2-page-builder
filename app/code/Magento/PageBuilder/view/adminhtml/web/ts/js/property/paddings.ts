/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class Paddings implements PropertyReaderInterface {
    /**
     * Read paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        return {
            padding: {
                left: element.style.paddingLeft,
                top: element.style.paddingTop,
                right: element.style.paddingRight,
                bottom: element.style.paddingBottom,
            },
        };
    }
}
