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
                left: element.style.paddingLeft,
                top: element.style.paddingTop,
                right: element.style.paddingRight,
                bottom: element.style.paddingBottom,
            }
        };
    }
}
