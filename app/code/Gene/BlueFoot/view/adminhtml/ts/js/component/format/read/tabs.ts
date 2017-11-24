/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";

export default class Tabs implements ReadInterface {

    /**
     * Read information from element for content type
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let response: DataObject = {
            'tabs': []
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll('.title'), (node, index) => {
            response.tabs[index] = {
                title: node.firstChild.innerHTML,
                content: node.nextSibling.innerHTML,
                record_id: index
            }
        });

        return Promise.resolve(response);
    }
}
