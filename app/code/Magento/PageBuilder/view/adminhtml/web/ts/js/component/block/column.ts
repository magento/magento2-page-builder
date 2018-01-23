/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import Block from "./block";

export default class Column extends Block {
    public getStyle() {
        const data = this.getData();
        if (typeof data.appearance !== "undefined" &&
            typeof data.appearances !== "undefined" &&
            typeof data.appearances[data.appearance] !== "undefined") {
            const appearances = {};
            _.each(data.appearances[data.appearance], (value, key) => {
                const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                const camelStyle = {};
                camelStyle[camelKey] = value;
                _.extend(appearances, camelStyle);
            });
            return _.extend(super.getStyle(), appearances);
        }
        return super.getStyle();
    }
}
