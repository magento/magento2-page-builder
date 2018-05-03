/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import "Magento_PageBuilder/js/resource/slick/slick.min";
import _ from "underscore";
import "../../../binding/ko-pagebuilder-noscrollonfocus";
import ContentTypeConfigInterface from "../../../content-type-config.d";
import createContentType from "../../../content-type-factory";
import ContentTypeInterface from "../../../content-type.d";
import ObservableUpdater from "../../../observable-updater";
import PreviewCollection from "../../../preview-collection";
import Config from "../../config";
import EventBus from "../../event-bus";
import {Option} from "../../stage/structural/options/option";
import {OptionInterface} from "../../stage/structural/options/option.d";
import BlockCreateEventParamsInterface from "../block-create-event-params.d";
import BlockMountEventParamsInterface from "../block-mount-event-params.d";
import BlockReadyEventParamsInterface from "../block-ready-event-params.d";
import {default as SliderPreview} from "../preview/slider";
import Slide from "./slide";
import {PreviewSortableSortUpdateEventParams} from "./sortable/binding";

export default class Slider extends PreviewCollection {
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
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);

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
            if (value !== null) {
                EventBus.trigger("interaction:start", {});
            } else {
                EventBus.trigger("interaction:stop", {});
            }
        });
    }

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
     * Add a slide into the slider
     */
    public addSlide() {
        createContentType(
            Config.getConfig("content_types").slide,
            this.parent,
            this.parent.stageId,
        ).then((slide) => {
            const mountFn = (event: Event, params: BlockMountEventParamsInterface) => {
                if (params.id === slide.id) {
                    _.delay(() => {
                        this.navigateToSlide(this.parent.children().length - 1);
                        slide.preview.onOptionEdit();
                    }, 500);
                    EventBus.off("slide:block:mount", mountFn);
                }
            };
            EventBus.on("slide:block:mount", mountFn);
            this.parent.addChild(slide, this.parent.children().length);
        });
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        // Block being mounted onto container
        EventBus.on("slider:block:dropped:create", (event: Event, params: BlockReadyEventParamsInterface) => {
            if (params.id === this.parent.id && this.parent.children().length === 0) {
                this.addSlide();
            }
        });

        // Block being removed from container
        EventBus.on("slide:block:removed", (event, params: BlockRemovedParams) => {
            if (params.parent.id === this.parent.id) {
                // Mark the previous slide as active
                const newIndex = (params.index - 1 >= 0 ? params.index - 1 : 0);
                (this as SliderPreview).setActiveSlide(newIndex);
                (this as SliderPreview).setFocusedSlide(newIndex, true);
            }
        });

        // Capture when a block is duplicated within the container
        let duplicatedSlide: Slide;
        let duplicatedSlideIndex: number;
        EventBus.on("slide:block:duplicate", (event, params: BlockDuplicateEventParams) => {
            if (params.duplicateBlock.parent.id === this.parent.id) {
                duplicatedSlide = (params.duplicateBlock as Slide);
                duplicatedSlideIndex = params.index;
            }
        });
        EventBus.on("slide:block:mount", (event: Event, params: BlockMountEventParamsInterface) => {
            if (duplicatedSlide && params.id === duplicatedSlide.id) {
                // Mark the new duplicate slide as active
                (this as SliderPreview).navigateToSlide(duplicatedSlideIndex);
                // Force the focus of the slide, as the previous slide will have focus
                (this as SliderPreview).setFocusedSlide(duplicatedSlideIndex, true);
                duplicatedSlide = duplicatedSlideIndex = null;
            }
        });
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
        const data = this.parent.store.get(this.parent.id);
        return {
            arrows: data.show_arrows === "1",
            autoplay: data.autoplay === "1",
            autoplaySpeed: data.autoplay_speed,
            dots: false, // We have our own dots implemented
            fade: data.fade === "1",
            infinite: data.is_infinite === "1",
        };
    }
}
