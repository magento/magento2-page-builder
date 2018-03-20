/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "../property-reader-interface";
import Margins from "./margins";
import Paddings from "./paddings";

export default class MarginsAndPaddings implements PropertyReaderInterface {
    private margins: Margins;
    private paddings: Paddings;

    constructor() {
        this.margins = new Margins();
        this.paddings = new Paddings();
    }

    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public read(element: HTMLElement): string | object {
        return Object.assign(
            this.margins.read(element),
            this.paddings.read(element),
        );
    }
}
