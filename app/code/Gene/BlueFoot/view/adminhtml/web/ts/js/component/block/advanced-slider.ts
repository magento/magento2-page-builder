/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import Config from "../config";
import createBlock from "../block/factory";
'use strict';
/*eslint-disable */
export default class AdvancedSlider extends Block {

    /**
     * Add a slide into the slider
     */
    addSlide() {
        createBlock(Config.getInitConfig('contentTypes')['slide'], this.parent, this.stage, {}).then((slide) => {
            this.addChild(slide);
            slide.edit.open();
        });
    }
}
