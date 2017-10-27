/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class Heading {
    /**
     * Read heading type and title from the element
     *
     * @param element
     * @returns {object}
     */
    public read (element: HTMLElement): object {
        return {
            'heading_type': element.nodeName,
            'title': element.innerText
        };
    }
}
