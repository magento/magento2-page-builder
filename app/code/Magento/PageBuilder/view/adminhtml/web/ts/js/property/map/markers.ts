/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";

export default class Markers implements PropertyReaderInterface {
    /**
     * Read markers from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        if (element.getAttribute("data-markers") !== "") {
            return JSON.parse(element.getAttribute("data-markers"))[0];
        }
        return;
    }
}
