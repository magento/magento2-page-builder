/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";
'use strict';

export default class Accordion implements ReadInterface {

    /**
     * Read information from element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let response: DataObject = {
            'items': []
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll('[data-collapsible="true"]'), (node, index) => {
            response.items[index] = {
                title: node.firstChild.firstChild.innerHTML,
                content: node.nextSibling.innerHTML,
                open_on_load: node.getAttribute('data-open-on-load'),
                record_id: index
            }
        });

        return Promise.resolve(response);
    }
}
