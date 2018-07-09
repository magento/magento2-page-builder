/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import "Magento_PageBuilder/js/resource/slick/slick.min";
import events from "uiEvents";
import _ from "underscore";
import "../../binding/focus";
import {PreviewSortableSortUpdateEventParams} from "../../binding/sortable-children";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection";
import ContentTypeConfigInterface from "../../content-type-config.d";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeInterface from "../../content-type.d";
import {DataObject} from "../../data-store";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params";
import ContentTypeCreateEventParamsInterface from "../content-type-create-event-params.d";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params.d";
import ContentTypeReadyEventParamsInterface from "../content-type-ready-event-params.d";
import ContentTypeDuplicateEventParamsInterface from "../content-type-ready-event-params.d";
import ContentTypeRemovedEventParamsInterface from "../content-type-removed-event-params.d";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";
import Slide from "../slide/preview";
import {default as SliderPreview} from "../slider/preview";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public focusedSlide: KnockoutObservable<number> = ko.observable();
    public activeSlide: KnockoutObservable<number> = ko.observable(0);
    private element: Element;
    private childSubscribe: KnockoutSubscription;
    private contentTypeHeightReset: boolean;
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
                if (!this.contentTypeHeightReset) {
                    $(this.element).css({
                        height: "",
                        overflow: "",
                    });
                    this.contentTypeHeightReset = null;
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

        this.childSubscribe = this.parent.children.subscribe(this.buildSlick);
        this.parent.dataStore.subscribe(this.buildSlick);

        // Set the stage to interacting when a slide is focused
        this.focusedSlide.subscribe((value: number) => {
            if (value !== null) {
                events.trigger("stage:interactionStart");
            } else {
                events.trigger("stage:interactionStop");
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
            this.contentTypeHeightReset = true;
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
            events.on("slide:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
                if (args.id === slide.id) {
                    _.delay(() => {
                        this.navigateToSlide(this.parent.children().length - 1);
                        slide.preview.onOptionEdit();
                    }, 500 );
                    events.off(`slide:${slide.id}:mountAfter`);
                }
            }, `slide:${slide.id}:mountAfter`);
            this.parent.addChild(slide, this.parent.children().length);
        });
    }

    /**
     * Slider can not receive drops by default
     *
     * @returns {boolean}
     */
    public isContainer() {
        return false;
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        // We only start forcing the containers height once the slider is ready
        let sliderReady: boolean = false;
        events.on("slider:mountAfter", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.parent.id) {
                sliderReady = true;
            }
        });

        // Set the active slide to the new position of the sorted slide
        events.on("childContentType:sortUpdate", (args: PreviewSortableSortUpdateEventParams) => {
            if (args.instance.id === this.parent.id) {
                $(args.ui.item).remove(); // Remove the item as the container's children is controlled by knockout
                this.setActiveSlide(args.newPosition);
            }
        });

        // When a slide content type is removed
        // we need to force update the content of the slider due to KO rendering issues
        let newItemIndex: number;
        events.on("slide:removeAfter", (args: ContentTypeRemovedEventParamsInterface) => {
            if (args.contentType.parent.id === this.parent.id) {
                // Mark the previous slide as active
                newItemIndex = (args.index - 1 >= 0 ? args.index - 1 : 0);

                this.forceContainerHeight();
                const data = this.parent.children().slice(0);
                this.parent.children([]);
                this.parent.children(data);
            }
        });

        events.on("slide:renderAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            const itemIndex = (args.contentType.parent as ContentTypeCollectionInterface)
                .getChildren()().indexOf(args.contentType);
            if ((args.contentType.parent.id === this.parent.id) &&
                (newItemIndex !== null && newItemIndex === itemIndex)
            ) {
                _.defer(() => {
                    if (newItemIndex !== null) {
                        newItemIndex = null;
                        (this as SliderPreview).navigateToSlide(itemIndex, true, true);
                        _.defer(() => {
                            this.focusedSlide(null);
                            this.focusedSlide(itemIndex);
                        });
                    }
                });
            }
        });

        // On a slide content types creation we need to lock the height of the slider to ensure a smooth transition
        events.on("slide:createAfter", (args: ContentTypeCreateEventParamsInterface) => {
            if (this.element && sliderReady && args.contentType.parent.id === this.parent.id) {
                this.forceContainerHeight();
            }
        });

        // ContentType being mounted onto container
        events.on("slider:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id && this.parent.children().length === 0) {
                this.addSlide();
            }
        });

        // Capture when a content type is duplicated within the container
        let duplicatedSlide: Slide;
        let duplicatedSlideIndex: number;
        events.on("slide:duplicateAfter", (args: ContentTypeDuplicateEventParamsInterface) => {
            if (args.duplicateContentType.parent.id === this.parent.id) {
                duplicatedSlide = (args.duplicateContentType as Slide);
                duplicatedSlideIndex = args.index;
            }
        });
        events.on("slide:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (duplicatedSlide && args.id === duplicatedSlide.id) {
                _.defer(() => {
                    // Mark the new duplicate slide as active
                    (this as SliderPreview).navigateToSlide(duplicatedSlideIndex, true, true);
                    duplicatedSlide = duplicatedSlideIndex = null;
                });
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
        const data = this.parent.dataStore.get() as DataObject;
        return {
            arrows: data.show_arrows === "true",
            autoplay: data.autoplay === "true",
            autoplaySpeed: data.autoplay_speed,
            dots: false, // We have our own dots implemented
            fade: data.fade === "true",
            infinite: data.is_infinite === "true",
            waitForAnimate: false,
        };
    }
}
