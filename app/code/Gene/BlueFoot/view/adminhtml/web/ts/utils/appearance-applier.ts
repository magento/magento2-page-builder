/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../component/data-store";
import ColumnAlignTop from "../component/appearance/column/align-top";
import ColumnAlignMiddle from "../component/appearance/column/align-middle";
import ColumnAlignBottom from "../component/appearance/column/align-bottom";

export default class AppearanceApplier {
    appearances: any;

    constructor() {
        this.appearances = {
            column: {
                top: new ColumnAlignTop(),
                middle: new ColumnAlignMiddle(),
                bottom: new ColumnAlignBottom()
            }
        }
    }

    /**
     * @param data
     * @returns {object}
     */
    getAppearanceData(data: DataObject): object {
        const role =  data['name'] !== 'undefined' ? data['name'] : data['role'];
        return (this.appearances[role] !== undefined && this.appearances[role][data['appearance']] !== undefined)
            ? this.appearances[role][data['appearance']].getData()
            : {};
    }
}
