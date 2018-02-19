/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import "Magento_PageBuilder/js/resource/slick/slick";
import _ from "underscore";
import {ConfigContentBlock} from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Slider extends PreviewBlock {
    private element: Element;
    private childSubscribe: KnockoutSubscription;

    /**
     * Assign a debounce and delay to the init of slick to ensure the DOM has updated
     *
     * @type {(() => any) & _.Cancelable}
     */
    private buildSlick = _.debounce(() => {
        if (this.element && this.element.children.length > 0) {
            try {
                $(this.element).slick("unslick");
            } catch (e) {
                // We aren't concerned if this fails, slick throws an Exception when we cannot unslick
            }

            // Dispose current subscription in order to prevent infinite loop
            this.childSubscribe.dispose();

            // Force an update on all children, ko tries to intelligently re-render but fails
            const data = this.parent.children().slice(0);
            this.parent.children([]);
            $(this.element).empty();
            this.parent.children(data);

            // Re-subscribe original event
            this.childSubscribe = this.parent.children.subscribe(this.buildSlick);

            // Build slick
            $(this.element).slick(
                Object.assign(
                    {
                        initialSlide: this.data.activeSlide() || 0,
                    },
                    this.buildSlickConfig(),
                ),
            );

            // Update our KO pointer to the active slide on change
            $(this.element).on("beforeChange", (
                event: Event,
                slick: {},
                currentSlide: any,
                nextSlide: any,
            ) => {
                this.setActiveSlide(nextSlide);
            });
        }
    }, 10);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        this.childSubscribe = this.parent.children.subscribe(this.buildSlick);
        this.parent.stage.store.subscribe(this.buildSlick);
    }

    /**
     * Capture an after render event
     */
    public onAfterRender(): void {
        this.buildSlick();
    }

    /**
     * Set an active slide for navigation dot
     *
     * @param slideIndex
     */
    public setActiveSlide(slideIndex: number): void {
        this.data.activeSlide(slideIndex);
    }

    /**
     * Navigate to a slide
     *
     * @param {number} slideIndex
     * @param {boolean} dontAnimate
     */
    public navigateToSlide(slideIndex: number, dontAnimate: boolean = false): void {
        $(this.element).slick("slickGoTo", slideIndex, dontAnimate);
        this.setActiveSlide(slideIndex);
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    public afterChildrenRender(element: Element): void {
        this.element = element;
    }

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();
        this.updateDataValue("activeSlide", 0);
    }

    /**
     * Build the slack config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number);
     * fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */
    private buildSlickConfig() {
        return {
            arrows: this.data.show_arrows() === "1",
            autoplay: this.data.autoplay() === "1",
            autoplaySpeed: this.data.autoplay_speed(),
            dots: false, // We have our own dots implemented
            fade: this.data.fade() === "1",
            infinite: this.data.is_infinite() === "1",
        };
    }
}
