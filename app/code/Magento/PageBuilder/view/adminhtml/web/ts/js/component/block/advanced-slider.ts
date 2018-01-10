/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import createBlock from "../block/factory";
import Config from "../config";
import Block from "./block";

export default class AdvancedSlider extends Block {

    /**
     * Add a slide into the slider
     */
    public addSlide() {
        createBlock(Config.getInitConfig("contentTypes").slide,
            this.parent, this.stage, {}).then((slide) => {
            this.addChild(slide);
            slide.edit.open();
        });
    }
}
