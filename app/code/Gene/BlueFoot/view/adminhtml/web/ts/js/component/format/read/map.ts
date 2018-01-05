/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";
'use strict';
/*eslint-disable */
export default class Tabs implements ReadInterface {

    /**
     * Read map position and zoom from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let pattern = /maps\/embed\/v1\/place\?q=(-?[0-9.]*),*\s*(-?[0-9.]*)&zoom=*\s*([0-9]+)&key=([a-zA-Z0-9]+)/;
        if (element.getAttribute('src') && pattern.test(element.getAttribute('src'))) {
            return Promise.resolve({
                'position': pattern.exec(element.getAttribute('src')).slice(1).join(',')
            });
        }
    }
}
