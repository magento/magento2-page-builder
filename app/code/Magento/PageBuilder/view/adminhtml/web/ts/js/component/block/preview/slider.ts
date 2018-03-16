/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "Magento_PageBuilder/js/resource/slick/slick";
import _ from "underscore";
import "../../../utils/focus-binding";
import {ConfigContentBlock} from "../../config";
import EventBus from "../../event-bus";
import Block from "../block";
import PreviewBlock from "./block";
import {PreviewSortableSortUpdateEventParams} from "./sortable/binding";

export default class Slider extends PreviewBlock {
    public focusedSlide: KnockoutObservable<number> = ko.observable();
    public activeSlide: KnockoutObservable<number> = ko.observable();
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
                        initialSlide: this.activeSlide() || 0,
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

        // Set the active slide to the new position of the sorted slide
        EventBus.on("previewSortable:sortupdate", (event: Event, params: PreviewSortableSortUpdateEventParams) => {
            if (params.instance.id === this.parent.id) {
                $(params.ui.item).remove(); // Remove the item as the container's children is controlled by knockout
                this.setActiveSlide(params.newPosition);
            }
        });

        // Set the stage to interacting when a slide if focused
        this.focusedSlide.subscribe((value: number) => {
            this.parent.stage.interacting(value !== null);
        });
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
        this.activeSlide(slideIndex);
    }

    /**
     * Set the focused slide
     *
     * @param {number} slideIndex
     * @param {boolean} force
     */
    public setFocusedSlide(slideIndex: number, force: boolean = false): void {
        if (force) {
            this.focusedSlide(null);
        }
        this.focusedSlide(slideIndex);
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
        this.setFocusedSlide(slideIndex);
    }

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    public afterChildrenRender(element: Element): void {
        super.afterChildrenRender(element);
        this.element = element;
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
