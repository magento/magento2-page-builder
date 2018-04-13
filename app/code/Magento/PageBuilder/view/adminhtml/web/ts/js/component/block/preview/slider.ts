/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import "Magento_PageBuilder/js/resource/slick/slick.min";
import _ from "underscore";
import "../../../binding/focus";
import Preview from "../../../preview";
import {ConfigContentBlock} from "../../config";
import EventBus from "../../event-bus";
import {BlockRemovedParams} from "../../stage/event-handling-delegate";
import Block from "../block";
import BlockCreateEventParamsInterface from "../block-create-event-params.d";
import BlockReadyEventParamsInterface from "../block-ready-event-params.d";
import {PreviewSortableSortUpdateEventParams} from "./sortable/binding";

export default class Slider extends Preview {
    public focusedSlide: KnockoutObservable<number> = ko.observable();
    public activeSlide: KnockoutObservable<number> = ko.observable(0);
    private element: Element;
    private childSubscribe: KnockoutSubscription;
    private blockHeightReset: boolean;

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
            $(this.element).on(
                "beforeChange",
                (event: Event, slick: {}, currentSlide: any, nextSlide: any) => {
                    this.setActiveSlide(nextSlide);
                },
            ).on("afterChange", () => {
                if (!this.blockHeightReset) {
                    $(this.element).css({
                        height: "",
                        overflow: "",
                    });
                    this.blockHeightReset = null;
                }
            });
        }
    }, 10);

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        // We only start forcing the containers height once the slider is ready
        let sliderReady: boolean = false;
        EventBus.on("slider:block:ready", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.parent.id) {
                sliderReady = true;
            }
        });

        this.childSubscribe = this.parent.children.subscribe(this.buildSlick);
        this.parent.store.subscribe(this.buildSlick);

        // Set the active slide to the new position of the sorted slide
        EventBus.on("previewSortable:sortupdate", (event: Event, params: PreviewSortableSortUpdateEventParams) => {
            if (params.instance.id === this.parent.id) {
                $(params.ui.item).remove(); // Remove the item as the container's children is controlled by knockout
                this.setActiveSlide(params.newPosition);
            }
        });
        // When a slide block is removed we need to force update the content of the slider due to KO rendering issues
        EventBus.on("slide:block:removed", (event: Event, params: BlockRemovedParams) => {
            if (params.block.parent.id === this.parent.id) {
                this.forceContainerHeight();
                const data = this.parent.children().slice(0);
                this.parent.children([]);
                this.parent.children(data);
            }
        });
        // On a slide blocks creation we need to lock the height of the slider to ensure a smooth transition
        EventBus.on("slide:block:create", (event: Event, params: BlockCreateEventParamsInterface) => {
            if (this.element && sliderReady && params.block.parent.id === this.parent.id) {
                this.forceContainerHeight();
            }
        });

        // Set the stage to interacting when a slide is focused
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
     * @param {boolean} force
     */
    public navigateToSlide(slideIndex: number, dontAnimate: boolean = false, force: boolean = false): void {
        $(this.element).slick("slickGoTo", slideIndex, dontAnimate);
        this.setActiveSlide(slideIndex);
        this.setFocusedSlide(slideIndex, force);
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
     * On sort start force the container height, also focus to that slide
     *
     * @param {Event} event
     * @param {JQueryUI.SortableUIParams} params
     */
    public onSortStart(event: Event, params: JQueryUI.SortableUIParams): void {
        this.forceContainerHeight();
        if (this.activeSlide() !== params.item.index() || this.focusedSlide() !== params.item.index()) {
            this.navigateToSlide(params.item.index(), false, true);
            // As we've completed a navigation request we need to ensure we don't remove the forced height
            this.blockHeightReset = true;
        }
    }

    /**
     * On sort stop ensure the focused slide and the active slide are in sync, as the focus can be lost in this
     * operation
     */
    public onSortStop(): void {
        if (this.activeSlide() !== this.focusedSlide()) {
            this.setFocusedSlide(this.activeSlide(), true);
        }
    }

    /**
     * To ensure smooth animations we need to lock the container height
     */
    private forceContainerHeight(): void {
        $(this.element).css({
            height: $(this.element).outerHeight(),
            overflow: "hidden",
        });
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
