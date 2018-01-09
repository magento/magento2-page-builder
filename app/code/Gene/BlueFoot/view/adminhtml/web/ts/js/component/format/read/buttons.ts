/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {DataObject} from "../../data-store";
import ReadInterface from "../read-interface";

export default class Buttons implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const response: DataObject = {
            buttons: [],
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll("a"), (node, index) => {
            response.buttons[index] = {
                link: node.getAttribute("href"),
                text: node.firstChild.innerText,
            };
        });

        return Promise.resolve(response);
    }
}
