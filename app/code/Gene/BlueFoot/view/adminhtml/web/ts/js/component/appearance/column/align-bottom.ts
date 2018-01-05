/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import AppearanceInterface from "../appearance-interface";
'use strict';
/*eslint-disable */
export default class AlignBottom implements AppearanceInterface {
    /**
     * Apply align bottom appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    add(data: DataObject): DataObject {
        data['align_self'] = 'flex-end';
        return data;
    }
}
