/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import PreviewBlock from "./block";
import Block from "../block"

export default class Row extends PreviewBlock {
    rowStyle: KnockoutComputed<{}>;
    rowCSS: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.rowStyle = ko.computed(() => {
            const style:any = {};
            style.
            return style;
        });

        this.rowCSS = ko.computed(() => {
            return this.data.css_classes
        })
    }
}