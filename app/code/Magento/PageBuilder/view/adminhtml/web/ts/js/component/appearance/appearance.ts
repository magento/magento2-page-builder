/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {AppearanceInterface} from "../appearance/appearance-interface";
import {DataObject} from "../data-store";

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
     * Does the instance and data have an appearance to apply?
     *
     * @param {} data
     * @returns {boolean}
     */
    public hasAppearances(data: DataObject): boolean {
        return (typeof this.appearances[data.appearance] !== "undefined");
    }

    /**
     * @param data
     * @returns {DataObject}
     */
    public add(data: DataObject): DataObject {
        if (data.appearance !== undefined) {
            if (!this.hasAppearances(data)) {
                console.error( "No appearances specified for content type." );
            }
            return this.appearances[data.appearance].add(data);
        }
        return data;
    }
}
