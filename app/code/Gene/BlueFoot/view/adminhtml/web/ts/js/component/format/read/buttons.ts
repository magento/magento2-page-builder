/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";
'use strict';

export default class Buttons implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let response: DataObject = {
            'buttons': []
        };

        // Iterate through the tabs and retrieve their content
        _.forEach(element.querySelectorAll('a'), (node, index) => {
            response.buttons[index] = {
                text: node.firstChild.innerText,
                link: node.getAttribute('href'),
            }
        });

        return Promise.resolve(response);
    }
}
