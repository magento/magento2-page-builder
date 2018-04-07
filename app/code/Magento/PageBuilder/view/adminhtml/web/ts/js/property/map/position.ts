/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";
import Markers from "./markers";
import Zoom from "./zoom";

export default class Position implements PropertyReaderInterface {
    private zoom: Zoom;
    private markers: Markers;

    constructor() {
        this.zoom = new Zoom();
        this.markers = new Markers();
    }

    /**
     * Read position from zoom and marker from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        return JSON.stringify(Object.assign(
            {},
            this.markers.read(element),
            this.zoom.read(element),
        ));
    }
}
