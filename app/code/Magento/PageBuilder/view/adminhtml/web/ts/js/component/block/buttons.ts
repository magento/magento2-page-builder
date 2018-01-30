/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import createBlock from "../block/factory";
import Config from "../config";
import Block from "./block";

export default class Buttons extends Block {

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
