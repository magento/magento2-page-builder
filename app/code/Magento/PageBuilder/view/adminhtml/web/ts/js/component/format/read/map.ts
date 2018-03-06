/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";

export default class Map implements ReadInterface {

    /**
     * Read map position and zoom from the element
     * Also removes display none back to inline-block for preview styles
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const pattern = /maps\/embed\/v1\/place\?q=(-?[0-9.]*),*\s*(-?[0-9.]*)&zoom=*\s*([0-9]+)&key=([a-zA-Z0-9]+)/;
        const result: any = {
            display: "inline-block",
        };

        if (element.getAttribute("src") && pattern.test(element.getAttribute("src"))) {
            result.position = pattern.exec(element.getAttribute("src")).slice(1).join(",");
        }
        return Promise.resolve(
            result,
        );
    }
}
