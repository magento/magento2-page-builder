/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {AppearanceInterface} from "../appearance-interface";

export default class FullHeight implements AppearanceInterface {
    /**
     * Apply full height appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public add(data: DataObject): DataObject {
        data.align_self = "stretch";
        return data;
    }
}
