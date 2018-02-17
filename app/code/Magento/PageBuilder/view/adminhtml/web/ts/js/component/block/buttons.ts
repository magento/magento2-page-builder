/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import Block from "./block";
import ButtomItemBlock from "./button-item";

export default class Buttons extends Block {

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createBlockPromise: Promise<ButtomItemBlock> = createBlock(
            Config.getInitConfig("content_types")["button-item"],
            this.parent,
            this.stage,
            {},
        );

        createBlockPromise.then((button: ButtomItemBlock) => {
            this.addChild(button);
            return button;
        }).then(delayedPromise(300)).then((button: ButtomItemBlock) => {
            button.edit.open();
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
