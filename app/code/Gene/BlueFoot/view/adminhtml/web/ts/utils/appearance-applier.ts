/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../component/data-store";
import AppearancesInterface from "../component/appearance/appearance-interface";

export default class AppearanceApplier {
    // Content type appearances
    appearances: { [key: string]: AppearancesInterface; };

    constructor(appearances: any) {
        this.appearances = appearances;
    }

    /**
     * @param data
     * @returns {DataObject}
     */
    apply(data: DataObject): DataObject {
        if (data['appearance'] !== undefined) {
            if (this.appearances[data['appearance']] === undefined) {
                console.error('No appearances specified for content type.');
            }
            return this.appearances[data['appearance']].apply(data);
        }
        return data;
    }
}
