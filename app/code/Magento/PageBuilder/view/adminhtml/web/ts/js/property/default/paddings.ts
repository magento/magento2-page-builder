/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";

export default class Paddings implements PropertyReaderInterface {
    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public read(element: HTMLElement): string | object {
        return {
            padding: {
                bottom: element.style.paddingBottom,
                left: element.style.paddingLeft,
                right: element.style.paddingRight,
                top: element.style.paddingTop,
            },
        };
    }
}
