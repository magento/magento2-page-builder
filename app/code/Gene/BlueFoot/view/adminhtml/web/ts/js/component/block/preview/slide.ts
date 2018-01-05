/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import {Dictionary} from "underscore";
import hljs from "bluefoot/highlight";
import Block from "../block";
import PreviewBlock from "./block";
'use strict';

export default class Slide extends PreviewBlock {
    backgroundImageStyle: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);

        this.backgroundImageStyle = ko.computed(() => {
            if (this.data.background_image && typeof this.data.background_image()[0] === 'object') {
                return {backgroundImage: 'url(' + this.data.background_image()[0].url + ')'};
            }
            return {};
        });
    }
}
