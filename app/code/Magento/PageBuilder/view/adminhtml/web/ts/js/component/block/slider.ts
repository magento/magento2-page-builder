/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "uiEvents";
import _ from "underscore";
import createBlock, {BlockReadyEventParams} from "../block/factory";
import Config from "../config";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import {BlockDuplicateEventParams, BlockMountEventParams} from "../stage/structural/editable-area";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";
import {default as SliderPreview} from "./preview/slider";
import Slide from "./slide";

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
                ["add-child"],
                10,
            ),
        );
        return options;
    }

    /**
     * Add a slide into the slider
     */
    public addSlide() {
        createBlock(
            Config.getInitConfig("content_types").slide,
            this,
            this.stage,
        ).then((slide) => {
            _.delay(() => {
                const mountFn = (args: BlockMountEventParams) => {
                    if (args.id === slide.id) {
                        (this.preview as SliderPreview).navigateToSlide(this.children().length - 1);
                        _.delay(() => {
                            slide.edit.open();
                        }, 500);
                        events.off("slide:block:mount:tab");
                    }
                };
                events.on("slide:block:mount", mountFn, "slide:block:mount:tab");
                this.addChild(slide, this.children().length);
            });
        });
    }

    /**
     * Bind events for the current instance
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        events.on("slider:block:ready", (args: BlockReadyEventParams) => {
            if (args.id === this.id && this.children().length === 0) {
                this.addSlide();
            }
        });

        // Block being removed from container
        events.on("slide:block:removed", (args: BlockRemovedParams) => {
            if (args.parent.id === this.id) {
                // Mark the previous slide as active
                const newIndex = (args.index - 1 >= 0 ? args.index - 1 : 0);
                (this.preview as SliderPreview).setActiveSlide(newIndex);
                (this.preview as SliderPreview).setFocusedSlide(newIndex, true);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedSlide: Slide;
        let duplicatedSlideIndex: number;
        events.on("slide:block:duplicate", (args: BlockDuplicateEventParams) => {
            if (args.duplicate.parent.id === this.id) {
                duplicatedSlide = (args.duplicate as Slide);
                duplicatedSlideIndex = args.index;
            }
        });
        events.on("slide:block:mount", (args: BlockMountEventParams) => {
            if (duplicatedSlide && args.id === duplicatedSlide.id) {
                // Mark the new duplicate slide as active
                (this.preview as SliderPreview).navigateToSlide(duplicatedSlideIndex);
                // Force the focus of the slide, as the previous slide will have focus
                (this.preview as SliderPreview).setFocusedSlide(duplicatedSlideIndex, true);
                duplicatedSlide = duplicatedSlideIndex = null;
            }
        });
    }
}
