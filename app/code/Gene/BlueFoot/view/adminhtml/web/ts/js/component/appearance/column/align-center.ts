/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import AppearanceInterface from "../appearance-interface";
'use strict';

export default class AlignCenter implements AppearanceInterface {

    /**
     * Apply align middle appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    add(data: DataObject): DataObject {
        data['align_self'] = 'center';
        return data;
    }
}
