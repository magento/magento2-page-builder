/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygEvents from "mage/adminhtml/wysiwyg/events";
import _ from "underscore";
import {AdditionalDataConfigInterface} from "../../../../content-type-config.types";
import delayUntil from "../../../../utils/delay-until";
import WysiwygComponentInitializerInterface from "../../../../wysiwyg/component-initializer-interface";
import WysiwygInterface from "../../../../wysiwyg/wysiwyg-interface";

export default class ComponentInitializer implements WysiwygComponentInitializerInterface {
    /**
     * The editor element
     */
    private $element: JQuery;

    /**
     * The configuration of the wysiwyg content type
     */
    private config: AdditionalDataConfigInterface;

    /**
     * Slider transform
     */
    private sliderTransform: string;

    /**
     * Slider selector
     */
    private sliderSelector: string = ".slick-list";

    /**
     * Slider content selector
     */
    private sliderContentSelector: string = ".slick-track";

    /**
     * Slide selector
     */
    private slideSelector: string = ".slick-slide";

    /**
     * Active slide selector
     */
    private activeSlideSelector: string = ".slick-current";

    /**
     * Slider autoplay
     */
    private autoplay: boolean;

    /**
     * Slider fade
     */
    private fade: boolean;

    /**
     * Slider changing flag
     */
    private slideChanging: boolean = false;

    /**
     * Initialize the instance
     *
     * @param {Wysiwyg} wysiwyg
     */
    public initialize(wysiwyg: WysiwygInterface): void {
        this.$element = $("#" + wysiwyg.elementId);
        this.config = wysiwyg.config;
        const tinymce = wysiwyg.getAdapter();

        tinymce.eventBus.attachEventHandler(WysiwygEvents.afterFocus, this.onFocus.bind(this));
        tinymce.eventBus.attachEventHandler(WysiwygEvents.afterBlur, this.onBlur.bind(this));
        // Update our KO pointer to the active slide on change
        $(this.$element.parents(this.sliderSelector)).parent().on(
            "beforeChange",
            () => {
                this.slideChanging = true;
            },
        ).on("afterChange", () => {
            this.slideChanging = false;
        });
    }

    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    private onFocus() {
        const $slider = $(this.$element.parents(this.sliderSelector));
        const sliderContent = this.$element.parents(this.sliderContentSelector)[0];
        const $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

        // If there isn't enough room for a left-aligned toolbar, right align it
        if ($(window).width() <
            this.$element.offset().left + parseInt(this.config.adapter_config.minToolbarWidth, 10)
        ) {
            this.$element.addClass("_right-aligned-toolbar");
        }
        else {
            this.$element.removeClass("_right-aligned-toolbar");
        }

        delayUntil(
            () => {
                $.each(this.config.adapter_config.parentSelectorsToUnderlay, (i, selector) => {
                    this.$element.closest(selector as string).css("z-index", 100);
                });

                // Disable slider keyboard events and fix problem with overflow hidden issue
                $slider.parent().slick("slickSetOption", "accessibility", false);
                this.autoplay = $slider.parent().slick("slickGetOption", "autoplay") as boolean;
                this.fade = $slider.parent().slick("slickGetOption", "fade") as boolean;
                if (this.autoplay) {
                    $slider.parent().slick("slickPause");
                }
                if (!this.fade) {
                    $notActiveSlides.css("display", "none");
                }
                this.sliderTransform = sliderContent.style.transform;
                sliderContent.style.transform = "";
                $slider.css("overflow", "visible");
            },
            () => !this.slideChanging,
            10,
        );
    }

    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    private onBlur() {
        const $slider = $(this.$element.parents(this.sliderSelector));
        const sliderContent = this.$element.parents(this.sliderContentSelector)[0];
        const $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

        $.each(this.config.adapter_config.parentSelectorsToUnderlay, (i, selector) => {
            this.$element.closest(selector as string).css("z-index", "");
        });

        // Enable slider keyboard events and revert changes made in onFocus
        $slider.css("overflow", "hidden");
        sliderContent.style.transform = this.sliderTransform;
        $notActiveSlides.css("display", "block");
        $slider.parent().slick("slickSetOption", "accessibility", true);
        if (this.autoplay) {
            $slider.parent().slick("slickPlay");
        }
    }
}
