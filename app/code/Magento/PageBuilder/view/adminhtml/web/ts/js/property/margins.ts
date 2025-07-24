/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import PropertyReaderInterface from "./property-reader-interface";

/**
 * @api
 */
export default class Margins implements PropertyReaderInterface {
    /**
     * Read margins from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    public read(element: HTMLElement): DataObjectMargins {
        return {
            margin: {
                left: element.style.marginLeft,
                top: element.style.marginTop,
                right: element.style.marginRight,
                bottom: element.style.marginBottom,
            },
        };
    }
}

export interface DataObjectMargins {
    margin?: {
        left: string;
        top: string;
        right: string;
        bottom: string;
    };
}
