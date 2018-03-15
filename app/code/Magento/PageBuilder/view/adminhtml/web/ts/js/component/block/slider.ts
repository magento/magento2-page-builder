/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import delayedPromise from "../../utils/delayed-promise";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import Block from "./block";

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
        });
        // Block being removed from container
        EventBus.on("block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                if (params.index > 0) {
                    this.preview.navigateToSlide(params.index - 1);
                } else {
                    this.preview.navigateToSlide(0);
                }
            }
        });
    }
}
