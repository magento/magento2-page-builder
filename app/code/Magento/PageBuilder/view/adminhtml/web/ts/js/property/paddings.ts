/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class Paddings implements PropertyReaderInterface {
    /**
     * Read paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): DataObjectPaddings {
        return {
            padding: {
                left: element.style.paddingLeft,
                top: element.style.paddingTop,
                right: element.style.paddingRight,
                bottom: element.style.paddingBottom,
            },
        };
    }
}

export interface DataObjectPaddings {
    padding?: {
        left: string;
        top: string;
        right: string;
        bottom: string;
    };
}
