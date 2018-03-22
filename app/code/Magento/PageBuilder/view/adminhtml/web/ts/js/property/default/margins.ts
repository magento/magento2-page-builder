/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";

export default class Margins implements PropertyReaderInterface {
    /**
     * Read margins from element
     *
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public read(element: HTMLElement): string | object {
        return {
            margin: {
                bottom: element.style.marginBottom,
                left: element.style.marginLeft,
                right: element.style.marginRight,
                top: element.style.marginTop,
            },
        };
    }
}
