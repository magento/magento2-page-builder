/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../../../property/property-reader-interface";

export default class MarginsAndPaddings implements PropertyReaderInterface {
    /**
     * Read maxWidth from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        return {
            maxWidth: element.style.maxWidth
        };
    }
}
