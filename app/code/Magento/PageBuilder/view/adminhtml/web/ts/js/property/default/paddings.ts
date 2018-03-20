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
                left: element.style.paddingLeft.replace("px", ""),
                top: element.style.paddingTop.replace("px", ""),
                right: element.style.paddingRight.replace("px", ""),
                bottom: element.style.paddingBottom.replace("px", ""),
            }
        };
    }
}
