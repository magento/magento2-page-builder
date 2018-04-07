/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";

export default class Zoom implements PropertyReaderInterface {
    /**
     * Read zoom from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        if (element.getAttribute("data-zoom")) {
            return {
                zoom: parseInt(element.getAttribute("data-zoom"), 10),
            };
        }
        return {};
    }
}
