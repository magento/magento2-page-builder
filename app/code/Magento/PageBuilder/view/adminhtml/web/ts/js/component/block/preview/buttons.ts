/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import createBlock from "../../block/factory";
import Config from "../../config";
import PreviewBlock from "./block";
import Block from "../block";

export default class Buttons extends PreviewBlock {
    constructor(parent: Block, config: object) {
        super(parent, config);
    }

    /**
     * Add a button into the buttons container
     */
    public addButton() {
        createBlock(Config.getInitConfig("contentTypes").button,
            this.parent, this.stage, {}).then((button) => {
            this.addChild(button);
            button.edit.open();
        });
    }
}
