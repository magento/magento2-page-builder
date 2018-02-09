/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {AppearanceInterface} from "../appearance-interface";

export default class AlignTop implements AppearanceInterface {
    /**
     * Apply align top appearance
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    public add(data: DataObject): DataObject {
        data.align_self = "flex-start";
        return data;
    }
}
