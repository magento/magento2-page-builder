/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Block from "./block";

export default class Row extends Block {
    /**
     * Get stype properties for an block
     * Example {'backgroundColor': '#cccccc'}
     *
     * @returns {DataObject}
     */
    getStyle() {
        const children:any = this.children();
        let styleAttributes:any  = {},
            isAllColumns:boolean = true;
        if (children.length !== 0) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].config.name !== 'column') {
                    isAllColumns = false;
                }
            }
        } else {
            isAllColumns = false;
        }
        if (isAllColumns) {
            styleAttributes['display'] = 'flex';
        }
        return _.extend(super.getStyle(), styleAttributes);
    }

    /**
     * Is parallax enabled?
     *
     * @returns {boolean}
     */

    isParallaxEnabled() {
        let data = this.getData();
        return !(data.enable_parallax === "" || data.enable_parallax === 'undefined' || data.enable_parallax === "0");
    }
}
