/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";

export default class Heading implements ReadInterface {
    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        return new Promise((resolve: (object: object) => void) => {
            resolve(
                {
                    heading_text: element.innerText,
                    heading_type: element.nodeName.toLowerCase(),
                },
            );
        });
    }
}
