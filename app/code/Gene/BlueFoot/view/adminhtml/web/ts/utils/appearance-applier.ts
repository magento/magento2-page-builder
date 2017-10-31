/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../component/data-store";

export default class AppearanceApplier {
    // Content types config
    appearances: any;

    constructor(appearances: any) {
        this.appearances = appearances;
    }

    /**
     * @param data
     * @returns {object}
     */
    apply(data: DataObject): object {
        const role: string =  data['name'];
        if (data['appearance'] !== undefined) {
            if (this.appearances[data['appearance']] === undefined) {
                console.log('No appearances specified for content type.');
            }
            return this.appearances[data['appearance']].apply(data);
        }
        return data;
    }
}
