/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";

/*eslint-disable */
export default class Code implements ReadInterface {
    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        return new Promise((resolve: Function) => {
            resolve(
                {
                    'snippet': element.children[0].innerHTML
                }
            );
        });
    }
}
