/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import _ from "underscore";
import createBlock from "../block/factory";
import Config from "../config";
import EventBus from "../event-bus";
import {BlockRemovedParams} from "../stage/event-handling-delegate";
import {Option} from "../stage/structural/options/option";
import {OptionInterface} from "../stage/structural/options/option.d";
import Block from "./block";
import BlockMountEventParamsInterface from "./block-mount-event-params.d";
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
            Config.getConfig("content_types").slide,
            this,
            this.stage,
        ).then((slide) => {
            _.delay(() => {
                const mountFn = (event: Event, params: BlockMountEventParamsInterface) => {
                    if (params.id === slide.id) {
                        (this.preview as SliderPreview).navigateToSlide(this.children().length - 1);
                        _.delay(() => {
                            slide.edit.open();
                        }, 500);
                        EventBus.off("slide:block:mount", mountFn);
                    }
                };
                EventBus.on("slide:block:mount", mountFn);
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
        EventBus.on("slider:block:ready", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.id && this.children().length === 0) {
                this.addSlide();
            }
        });

        // Block being removed from container
        EventBus.on("slide:block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.id) {
                // Mark the previous slide as active
                const newIndex = (params.index - 1 >= 0 ? params.index - 1 : 0);
                (this.preview as SliderPreview).setActiveSlide(newIndex);
                (this.preview as SliderPreview).setFocusedSlide(newIndex, true);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedSlide: Slide;
        let duplicatedSlideIndex: number;
        EventBus.on("slide:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            if (params.duplicate.parent.id === this.id) {
                duplicatedSlide = (params.duplicate as Slide);
                duplicatedSlideIndex = params.index;
            }
        });
        EventBus.on("slide:block:mount", (event: Event, params: BlockMountEventParamsInterface) => {
            if (duplicatedSlide && params.id === duplicatedSlide.id) {
                // Mark the new duplicate slide as active
                (this.preview as SliderPreview).navigateToSlide(duplicatedSlideIndex);
                // Force the focus of the slide, as the previous slide will have focus
                (this.preview as SliderPreview).setFocusedSlide(duplicatedSlideIndex, true);
                duplicatedSlide = duplicatedSlideIndex = null;
            }
        });
    }
}
