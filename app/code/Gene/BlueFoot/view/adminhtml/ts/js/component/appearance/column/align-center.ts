/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import AppearanceInterface from "../appearance-interface";

export default class AlignCenter implements AppearanceInterface {
    /**
     * Apply align middle appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    apply(data: DataObject): DataObject {
        data['align_self'] = 'center';
        return data;
    }
}