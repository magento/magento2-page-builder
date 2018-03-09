/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import createBlock from "../block/factory";
import Config from "../config";
import Block from "./block";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import EventBus from "../event-bus";
import delayedPromise from "../../utils/delayed-promise";

export default class Slider extends Block {

    /**
     * Add a slide into the slider
     */
    public addSlide() {
        // Set the active slide to the index of the new slide we're creating
        this.preview.data.activeSlide(this.children().length);

        createBlock(
            Config.getInitConfig("content_types").slide,
            this,
            this.stage,
        ).then(delayedPromise(300)).then((slide) => {
            this.addChild(slide, this.children().length);
            slide.edit.open();
        });
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        EventBus.on("slider:block:ready", (event: Event, params: {[key: string]: any}) => {
            if (params.id === this.id && this.children().length === 0) {
                this.addSlide();
            }
        })
        // Block being removed from container
        EventBus.on("block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                this.preview.data.activeSlide(params.index - 1);
            }
        });
    }
}
