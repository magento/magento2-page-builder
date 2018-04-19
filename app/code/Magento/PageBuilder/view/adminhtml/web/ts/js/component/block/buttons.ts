/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import {BlockMountEventParams} from "../stage/structural/editable-area";
import Block from "./block";

export default class Buttons extends Block {

    public bindEvents() {
        super.bindEvents();

        events.on("buttons:block:ready", (event: Event, args: BlockMountEventParams) => {
            if (args.id === this.id && this.children().length === 0) {
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
            this.preview.isLiveEditing(this.children().indexOf(button));
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
