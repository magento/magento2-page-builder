/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Margins from "./margins";
import Paddings from "./paddings";

export default class MarginsAndPaddings {
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

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {string | Object}
     */
    public write(name: string, data: object): string | object {
        return Object.assign(
            this.margins.write(name, data),
            this.paddings.write(name, data),
        );
    }
}
