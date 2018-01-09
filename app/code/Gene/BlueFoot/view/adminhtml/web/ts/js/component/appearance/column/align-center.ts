/**
 * Copyright © Magento, Inc. All rights reserved.
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
    public add(data: DataObject): DataObject {
        const alignSelf = "align_self";
        data[alignSelf] = "center";
        return data;
    }
}
