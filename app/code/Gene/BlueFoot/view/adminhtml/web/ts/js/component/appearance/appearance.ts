/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import AppearanceInterface from "../component/appearance/appearance-interface";
import {DataObject} from "../component/data-store";

interface AppearanceList {
    [key: string]: AppearanceInterface;
}

export default class Appearance {
    // List of type appearances
    private appearances: AppearanceList;

    constructor(appearances: AppearanceList) {
        this.appearances = appearances;
    }

    /**
     * @param data
     * @returns {DataObject}
     */
    public add(data: DataObject): DataObject {
        if (data.appearance !== undefined) {
            if (this.appearances[data.appearance] === undefined) {
                console.error( "No appearances specified for content type." );
            }
            return this.appearances[data.appearance].add(data);
        }
        return data;
    }
}
