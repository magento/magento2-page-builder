/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {DataObject} from "../../data-store";
import ReadInterface from "../read-interface";

/**
 * @api
 */
export default class Accordion implements ReadInterface {

    /**
     * Read information from element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const response: DataObject = {
            items: [],
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll("[data-collapsible='true']"), (node, index) => {
            response.items[index] = {
                content: node.nextSibling.innerHTML,
                open_on_load: node.getAttribute("data-open-on-load"),
                record_id: index,
                title: node.firstChild.firstChild.innerHTML,
            };
        });

        return Promise.resolve(response);
    }
}
