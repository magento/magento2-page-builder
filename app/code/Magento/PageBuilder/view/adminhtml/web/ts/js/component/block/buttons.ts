/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import Block from "./block";
import { Block as BlockInterface } from "./block.d";

export default class Buttons extends Block {

    public bindEvents() {
        super.bindEvents();

        EventBus.on("buttons:block:mount", (event: Event, params: {[key: string]: any}) => {
            if (params.id === this.id) {
                this.addButton();
            }
        });
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createBlockPromise: Promise<BlockInterface> = createBlock(
            Config.getInitConfig("content_types")["button-item"],
            this.parent,
            this.stage,
            {},
        );

        createBlockPromise.then((button: BlockInterface) => {
            this.addChild(button);
            return button;
        }).then(delayedPromise(300)).then((button: BlockInterface) => {
            button.edit.open();
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
