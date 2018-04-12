/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import BlockMountEventParamsInterface from "./block-mount-event-params.d";
import ContentTypeCollection from "../../content-type-collection";

export default class Buttons extends ContentTypeCollection {

    public bindEvents() {
        super.bindEvents();

        EventBus.on("buttons:block:ready", (event: Event, params: BlockMountEventParamsInterface) => {
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
            Config.getConfig("content_types")["button-item"],
            this.parent,
            this.stageId,
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
