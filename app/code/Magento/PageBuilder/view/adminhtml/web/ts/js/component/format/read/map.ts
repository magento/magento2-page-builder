/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ReadInterface} from "../read-interface";

export default class Map implements ReadInterface {

    /**
     * Read map position and zoom from the element
     * Also removes display none back to inline-block for preview styles
     *
     * @param {HTMLElement} element
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const result: any = {
            display: "inline-block",
        };

        if (element.getAttribute('data-markers')) {
            const markers = JSON.parse(element.getAttribute('data-markers').replace(/'/g, "\""));
            const zoom = element.getAttribute('data-zoom');
            result.position = markers[0] + "," + zoom;
        }
        return Promise.resolve(
            result,
        );
    }
}
