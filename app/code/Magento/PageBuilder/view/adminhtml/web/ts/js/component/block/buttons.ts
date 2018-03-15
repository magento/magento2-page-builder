/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import {BlockMountEventParams} from "../stage/structural/editable-area";
import Block from "./block";

export default class Buttons extends Block {

    public bindEvents() {
        super.bindEvents();

        EventBus.on("buttons:block:ready", (event: Event, params: BlockMountEventParams) => {
            if (params.id === this.id && this.children().length === 0) {
                this.addButton();
            }
        });
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createBlockPromise: Promise<Block> = createBlock(
            Config.getInitConfig("content_types")["button-item"],
            this.parent,
            this.stage,
            {},
        );

        createBlockPromise.then((button: Block) => {
            this.addChild(button);
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
