/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "slick";
import _ from "underscore";
import "../../binding/focus";
import {PreviewSortableSortUpdateEventParams} from "../../binding/sortable-children.types";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ContentTypeConfigInterface from "../../content-type-config.types";
import createContentType from "../../content-type-factory";
import HideShowOption from "../../content-type-menu/hide-show-option";
import Option from "../../content-type-menu/option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ContentTypeInterface from "../../content-type.types";
import {DataObject} from "../../data-store";
import delayUntil from "../../utils/delay-until";
import deferred, {DeferredInterface} from "../../utils/promise-deferred";
import {
    ContentTypeAfterRenderEventParamsInterface,
    ContentTypeCreateEventParamsInterface,
    ContentTypeDroppedCreateEventParamsInterface,
    ContentTypeDuplicateEventParamsInterface,
    ContentTypeMountEventParamsInterface,
    ContentTypeRemovedEventParamsInterface,
} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public focusedSlide: KnockoutObservable<number> = ko.observable();
    public activeSlide: KnockoutObservable<number> = ko.observable(0);
    public element: HTMLElement;
    protected events: DataObject = {
        columnWidthChangeAfter: "onColumnResize",
    };
    private navigationElement: HTMLElement;
    private ready: boolean = false;
    private childSubscribe: KnockoutSubscription;
    private focusedSlideSubscriber: KnockoutSubscription;
    private contentTypeHeightReset: boolean;
    private mountAfterDeferred: DeferredInterface = deferred();
    private afterChildrenRenderDeferred: DeferredInterface = deferred();
    private buildSlickDebounce = _.debounce(this.buildSlick.bind(this), 10);

    /**
     * Define keys which when changed should not trigger the slider to be rebuilt
     *
     * @type {string[]}
     */
    private ignoredKeysForBuild: string[] = [
        "display",
        "margins_and_padding",
        "border",
        "border_color",
        "border_radius",
        "border_width",
        "css_classes",
        "name",
        "text_align",
    ];
    private previousData: DataObject;

    /**
     * @param {ContentTypeCollectionInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        contentType: ContentTypeCollectionInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(contentType, config, observableUpdater);

        // Wait for the tabs instance to mount and the container to be ready
        Promise.all([
            this.afterChildrenRenderDeferred.promise,
            this.mountAfterDeferred.promise,
        ]).then(([element, expectedChildren]) => {
            // We always create 1 tab when dropping tabs into the instance
            expectedChildren = expectedChildren || 1;
            // Wait until all children's DOM elements are present before building the tabs instance
            delayUntil(
                () => {
                    this.element = element as HTMLElement;

                    this.childSubscribe = this.contentType.children.subscribe(this.buildSlickDebounce);
                    this.previousData = this.contentType.dataStore.getState();
                    this.contentType.dataStore.subscribe((data) => {
                        if (this.hasDataChanged(this.previousData, data)) {
                            this.buildSlickDebounce();
                        }
                        this.previousData = data;
                    });

                    this.buildSlick();

                    // Redraw slide after content type gets redrawn
                    events.on("contentType:redrawAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
                        const $element = $(this.element);

                        if (args.element && this.element && $element.closest(args.element).length) {
                            $element.slick("setPosition");
                        }
                    });

                    // Set the stage to interacting when a slide is focused
                    this.focusedSlideSubscriber = this.focusedSlide.subscribe((value: number) => {
                        if (value !== null) {
                            events.trigger("stage:interactionStart");
                        } else {
                            events.trigger("stage:interactionStop");
                        }
                    });
                    events.on(
                        `stage:${this.contentType.stageId}:fullScreenModeChangeAfter`,
                        this.onColumnResize.bind(this, [true]),
                    );
                    events.on(`stage:${this.contentType.stageId}:viewportChangeAfter`, () => {
                        if (this.element) {
                            $(this.element).slick("setPosition");
                            this.checkWidth();
                        }
                    });
                },
                () => $(element).find(".pagebuilder-slide").length === expectedChildren,
            );
        });
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.add = new Option({
            preview: this,
            icon: "<i class='icon-pagebuilder-add'></i>",
            title: $t("Add"),
            action: this.addSlide,
            classes: ["add-child"],
            sort: 10,
        });

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
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
     * Unset focused slide on focusout event.
     *
     * @param {PreviewCollection} data
     * @param {JQueryEventObject} event
     */
    public onFocusOut(data: PreviewCollection, event: JQueryEventObject) {
        let relatedTarget = event.relatedTarget;

        if (!relatedTarget && document.activeElement && !(document.activeElement instanceof HTMLBodyElement)) {
            relatedTarget = document.activeElement;
        }

        if (!relatedTarget) {
            this.setFocusedSlide(null);
            return;
        }

        const $relatedTarget = $(relatedTarget);

        const isRelatedTargetDescendantOfNavigation = $relatedTarget.closest(this.navigationElement).length;
        const isFocusedOnAnotherSlideInThisSlider = (
            $relatedTarget.hasClass("navigation-dot-anchor") &&
            isRelatedTargetDescendantOfNavigation
        );

        if (isFocusedOnAnotherSlideInThisSlider) {
            events.trigger("stage:interactionStop");
        } else if (!isRelatedTargetDescendantOfNavigation) {
            this.setFocusedSlide(null);
        }
    }

    /**
     * Set reference to navigation element in template
     *
     * @param {HTMLElement} navigationElement
     */
    public afterNavigationRender(navigationElement: HTMLElement): void {
        this.navigationElement = navigationElement;
    }

    /**
     * Navigate to a slide
     *
     * @param {number} slideIndex
     * @param {boolean} dontAnimate
     * @param {boolean} force
     */
    public navigateToSlide(slideIndex: number, dontAnimate: boolean = false, force: boolean = false): void {
        if ($(this.element).hasClass("slick-initialized")) {
            $(this.element).slick("slickGoTo", slideIndex, dontAnimate);
            this.setActiveSlide(slideIndex);
            this.setFocusedSlide(slideIndex, force);
        }
    }

    /**
     * After child render record element
     *
     * @param {HTMLElement} element
     */
    public afterChildrenRender(element: HTMLElement): void {
        this.element = element;

        // if slider has been re-rendered previously on this element, re-build
        if (this.ready) {
            this.buildSlick();
        }

        super.afterChildrenRender(element);
        this.afterChildrenRenderDeferred.resolve(element);
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
    public onSortStop(event: JQueryEventObject, params: JQueryUI.SortableUIParams): void {
        if (this.activeSlide() !== this.focusedSlide()) {
            this.setFocusedSlide(this.activeSlide(), true);
        }
        if (params.item.index() !== -1) {
            _.defer(this.focusElement.bind(this, event, params.item.index()));
        }
        _.defer(() => {
            $(this.element).css({
                height: "",
                overflow: "",
            });
        });
    }

    /**
     * Add a slide into the slider
     */
    public addSlide() {
        createContentType(
            Config.getConfig("content_types").slide,
            this.contentType,
            this.contentType.stageId,
        ).then((slide) => {
            events.on("slide:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
                if (args.id === slide.id) {
                    _.defer(() => {
                        // Wait until slick is initialized before trying to navigate
                        delayUntil(
                            () => this.navigateToSlide(this.contentType.children().length - 1),
                            () => $(this.element).hasClass("slick-initialized"),
                            10,
                        );
                    });
                    events.off(`slide:${slide.id}:mountAfter`);
                }
            }, `slide:${slide.id}:mountAfter`);
            this.contentType.addChild(slide, this.contentType.children().length);
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
     * Slider navigation click handler.
     *
     * @param {number} index
     * @param {Preview} context
     * @param {Event} event
     */
    public onControlClick(index: number, context: Preview, event: Event) {
        $(event.target).focus();
        this.navigateToSlide(index);
        this.setFocusedSlide(index);
    }

    /**
     * @inheritdoc
     */
    public destroy(): void {
        super.destroy();
        if (this.focusedSlideSubscriber) {
            this.focusedSlideSubscriber.dispose();
        }
    }

    /**
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();
        events.on("slider:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                if (args.expectChildren !== undefined) {
                    this.mountAfterDeferred.resolve(args.expectChildren);
                }
            }
        });

        // Set the active slide to the new position of the sorted slide
        events.on("childContentType:sortUpdate", (args: PreviewSortableSortUpdateEventParams) => {
            if (args.instance.id === this.contentType.id) {
                $(args.ui.item).remove(); // Remove the item as the container's children is controlled by knockout
                this.setActiveSlide(args.newPosition);
                _.defer(this.focusElement.bind(this, args.event, args.newPosition));
            }
        });

        // When a slide content type is removed
        // we need to force update the content of the slider due to KO rendering issues
        let newItemIndex: number;
        events.on("slide:removeAfter", (args: ContentTypeRemovedEventParamsInterface) => {
            if (args.parentContentType && args.parentContentType.id === this.contentType.id) {
                // Mark the previous slide as active
                newItemIndex = (args.index - 1 >= 0 ? args.index - 1 : 0);

                this.forceContainerHeight();
                const data = this.contentType.children().slice(0);
                this.contentType.children([]);
                this.contentType.children(data);

                _.defer(() => {
                    this.buildSlick();
                });
            }
        });

        events.on("slide:renderAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            const itemIndex = args.contentType.parentContentType.getChildren()().indexOf(args.contentType);
            if ((args.contentType.parentContentType.id === this.contentType.id) &&
                (newItemIndex !== null && newItemIndex === itemIndex)
            ) {
                _.defer(() => {
                    if (newItemIndex !== null) {
                        newItemIndex = null;
                        this.navigateToSlide(itemIndex, true, true);
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
            if (this.element && this.ready && args.contentType.parentContentType.id === this.contentType.id) {
                this.forceContainerHeight();
                _.defer(() => {
                    $(this.element).css({
                        height: "",
                        overflow: "",
                    });
                });
            }
        });

        // ContentType being mounted onto container
        events.on("slider:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.contentType.id && this.contentType.children().length === 0) {
                this.addSlide();
            }
        });

        // Capture when a content type is duplicated within the container
        let duplicatedSlide: ContentTypeInterface;
        let duplicatedSlideIndex: number;
        events.on("slide:duplicateAfter", (args: ContentTypeDuplicateEventParamsInterface) => {
            if (args.duplicateContentType.parentContentType.id === this.contentType.id && args.direct) {
                duplicatedSlide = args.duplicateContentType;
                duplicatedSlideIndex = args.index;
            }
        });
        events.on("slide:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (duplicatedSlide && args.id === duplicatedSlide.id) {
                _.defer(() => {
                    // Mark the new duplicate slide as active
                    this.navigateToSlide(duplicatedSlideIndex, true, true);
                    duplicatedSlide = duplicatedSlideIndex = null;
                });
            }
        });
    }

    /**
     * Determine if the data has changed, whilst ignoring certain keys which don't require a rebuild
     *
     * @param {DataObject} previousData
     * @param {DataObject} newData
     * @returns {boolean}
     */
    private hasDataChanged(previousData: DataObject, newData: DataObject) {
        previousData = _.omit(previousData, this.ignoredKeysForBuild);
        newData = _.omit(newData, this.ignoredKeysForBuild);
        return !_.isEqual(previousData, newData);
    }

    /**
     * Build our instance of slick
     */
    private buildSlick(): void {
        if (this.element && this.element.children.length > 0) {
            try {
                $(this.element).slick("unslick");
            } catch (e) {
                // We aren't concerned if this fails, slick throws an Exception when we cannot unslick
            }

            // Dispose current subscription in order to prevent infinite loop
            if (this.childSubscribe) {
                this.childSubscribe.dispose();
            }

            // Force an update on all children, ko tries to intelligently re-render but fails
            const data = this.contentType.children().slice(0);
            this.contentType.children([]);
            $(this.element).empty();
            this.contentType.children(data);

            // Re-subscribe original event
            this.childSubscribe = this.contentType.children.subscribe(this.buildSlickDebounce);

            // Bind our init event for slick
            $(this.element).on("init", () => {
                this.ready = true;
            });

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
                    $(this.element).css("pointer-events", "none");
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
                $(this.element).css("pointer-events", "");
            });
        }
    }

    /**
     * Take dropped element on focus.
     *
     * @param {JQueryEventObject} event
     * @param {number} index
     */
    private focusElement(event: JQueryEventObject, index: number) {
        const handleClassName = $(event.target).data("sortable").options.handle;

        $($(event.target).find(handleClassName)[index]).focus();
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
     * Build the slick config object
     *
     * @returns {{autoplay: boolean; autoplaySpeed: (any | number);
     * fade: boolean; infinite: boolean; arrows: boolean; dots: boolean}}
     */
    private buildSlickConfig() {
        const data = this.contentType.dataStore.getState();
        return {
            arrows: data.show_arrows === "true",
            autoplay: data.autoplay === "true",
            autoplaySpeed: data.autoplay_speed,
            dots: false, // We have our own dots implemented
            fade: data.fade === "true",
            infinite: data.is_infinite === "true",
            waitForAnimate: false,
            swipe: false,
        };
    }

    /**
     * Fit slider in column container
     *
     * @param params
     */
    private onColumnResize(params: any) {
        setTimeout(() => {
            if (this.element) {
                $(this.element).slick("setPosition");
                this.checkWidth();
            }
        }, 450);
    }

    /**
     * Check width and add class that marks element as small
     */
    private checkWidth() {
        if (this.element.offsetWidth < 410) {
            this.element.classList.add("slider-small-width");
        } else {
            this.element.classList.remove("slider-small-width");
        }
    }
}
