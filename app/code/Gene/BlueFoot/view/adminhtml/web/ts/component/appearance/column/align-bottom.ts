/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import {DataObject} from "../../data-store";
import AppearancesInterface from "../appearance-interface";

export default class AlignBottom implements AppearancesInterface {
    /**
     * Apply align bottom appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    apply(data: DataObject): DataObject {
        _.extend(data, {flex_grow: 1, align_self: 'flex-end'});
        return data;
    }
}
