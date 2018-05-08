/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../../../property/property-reader-interface";

export default class Position implements PropertyReaderInterface {

    /**
     * Read position from zoom and marker from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        const markers = element.getAttribute("data-markers") !== ""
            ? JSON.parse(element.getAttribute("data-markers"))[0]
            : {};
        const zoom = element.getAttribute("data-zoom")
            ? { zoom: parseInt(element.getAttribute("data-zoom"), 10)}
            : {};

        return JSON.stringify(Object.assign({}, markers, zoom));
    }
}
