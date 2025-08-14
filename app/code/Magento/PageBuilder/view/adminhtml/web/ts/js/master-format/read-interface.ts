/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

/**
 * @api
 */
export interface ReadInterface {
    /**
     * Read data from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    read(element: HTMLElement): Promise<any>;
}
