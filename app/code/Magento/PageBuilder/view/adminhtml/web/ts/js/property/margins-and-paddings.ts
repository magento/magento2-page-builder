/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Margins from "./margins";
import Paddings from "./paddings";
import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class MarginsAndPaddings implements PropertyReaderInterface {
    private margins: Margins;
    private paddings: Paddings;

    constructor() {
        this.margins = new Margins();
        this.paddings = new Paddings();
    }

    /**
     * Read margins and paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): string | object {
        return Object.assign(
            this.margins.read(element),
            this.paddings.read(element),
        );
    }
}
