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
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let pattern = /maps\/embed.*\s*center=(-?[0-9.]*),(-?[0-9.]*)&zoom=([0-9]*)/;
        if (element.getAttribute('src') && pattern.test(element.getAttribute('src'))) {
            return Promise.resolve({
                'position': pattern.exec(element.getAttribute('src')).slice(1).join(',')
            });
        }
    }
}
