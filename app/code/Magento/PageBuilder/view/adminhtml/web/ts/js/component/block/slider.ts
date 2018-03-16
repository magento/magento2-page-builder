/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import createBlock, {BlockReadyEventParams} from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";
import {BlockChildrenRenderedEventParams} from "./preview/block";
import {default as SliderPreview} from "./preview/slider";
import {BlockDuplicateEventParams} from "../stage/structural/editable-area";

export default class Slider extends Block {

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        options.push(
            new Option(
                this,
                "add",
                "<i class='icon-pagebuilder-add'></i>",
                $t("Add"),
                this.addSlide,
                ["add-slider"],
                10,
            ),
        );
        return options;
    }

    /**
     * Add a slide into the slider
     */
    public addSlide() {
        // Set the active slide to the index of the new slide we're creating
        (this.preview as SliderPreview).setActiveSlide(this.children().length);

        createBlock(
            Config.getInitConfig("content_types").slide,
            this,
            this.stage,
        ).then((slide) => {
            this.addChild(slide, this.children().length);
            (this.preview as SliderPreview).focusedSlide(this.children().length - 1);
            _.delay(() => {
                slide.edit.open();
            }, 500);
        });
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        EventBus.on("slider:block:ready", (event: Event, params: BlockReadyEventParams) => {
            if (params.id === this.id && this.children().length === 0) {
                this.addSlide();
            }
        });
        // Block being removed from container
        EventBus.on("slide:block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                (this.preview as SliderPreview).setActiveSlide(params.index - 1);
                (this.preview as SliderPreview).setFocusedSlide(params.index - 1, true);
            }
        });
        // Block being removed from container
        EventBus.on("slide:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            if (params.duplicate.parent.id === this.id) {
                // Mark the new duplicate slide as active
                (this.preview as SliderPreview).setActiveSlide(params.index);
                (this.preview as SliderPreview).setFocusedSlide(params.index, true);
            }
        });
    }
}
