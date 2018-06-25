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
export default class Tabs implements ReadInterface {

    /**
     * Read information from element for content type
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const response: DataObject = {
            tabs: [],
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll(".title"), (node, index) => {
            response.tabs[index] = {
                content: node.nextSibling.innerHTML,
                record_id: index,
                title: node.firstChild.innerHTML,
            };
        });

        return Promise.resolve(response);
    }
}
