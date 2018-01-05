/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import ko from "knockout";
'use strict';
/*eslint-disable */
export default class Buttons extends Block {
    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare our buttons, they'll get populated later
        this.data.buttons = ko.observableArray([]);
    }
}
