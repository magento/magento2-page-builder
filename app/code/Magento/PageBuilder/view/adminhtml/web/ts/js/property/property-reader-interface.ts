/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

/**
 * @api
 */
interface PropertyReaderInterface {
    /**
     * Read element data
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    read(element: HTMLElement, source: string): string | number | object;
}

export default PropertyReaderInterface;
