/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import {SortableOptionsInterface} from "../../binding/sortable-children.types";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ContentTypeConfigInterface from "../../content-type-config.types";
import createContentType from "../../content-type-factory";
import HideShowOption from "../../content-type-menu/hide-show-option";
import Option from "../../content-type-menu/option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import ContentTypeInterface from "../../content-type.types";
import delayUntil from "../../utils/delay-until";
import {
    ContentTypeAfterRenderEventParamsInterface,
    ContentTypeDroppedCreateEventParamsInterface,
    ContentTypeDuplicateEventParamsInterface,
    ContentTypeMountEventParamsInterface,
} from "../content-type-events.types";
import ObservableUpdater from "../observable-updater";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public focusedButton: KnockoutObservable<number> = ko.observable();

    private debouncedResizeHandler = _.debounce(() => {
        this.resizeChildButtons();
    }, 350);

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

        // Keeps track of number of button item to disable sortable if there is only 1.
        this.contentType.children.subscribe(() => {
            const sortableElement = $(this.wrapperElement).find(".buttons-container");
            if (!sortableElement.data("ui-sortable")) {
                return;
            }
            if (this.contentType.children().length <= 1) {
                sortableElement.sortable("disable");
            } else {
                sortableElement.sortable("enable");
            }
        });

        // Monitor focus tab to start / stop interaction on the stage, debounce to avoid duplicate calls
        this.focusedButton.subscribe(_.debounce((index: number) => {
            if (index !== null) {
                events.trigger("stage:interactionStart");
                const focusedButton = this.contentType.children()[index];
                delayUntil(
                    () => $(focusedButton.preview.wrapperElement).find("[contenteditable]").focus(),
                    () => typeof focusedButton.preview.wrapperElement !== "undefined",
                    10,
                );
            } else {
                // We have to force the stop as the event firing is inconsistent for certain operations
                events.trigger("stage:interactionStop", {force: true});
            }
        }, 1));
    }

    /**
     * Bind events
     */
    public bindEvents() {
        super.bindEvents();

        events.on("buttons:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.contentType.id && this.contentType.children().length === 0) {
                this.addButton();
            }
        });

        events.on("buttons:renderAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            if (args.contentType.id === this.contentType.id) {
                this.debouncedResizeHandler();
            }
        });

        events.on("button-item:renderAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            if (args.contentType.parentContentType.id === this.contentType.id) {
                this.debouncedResizeHandler();
            }
        });

        events.on("stage:updateAfter", () => {
            this.debouncedResizeHandler();
        });

        events.on("contentType:redrawAfter", () => {
            this.debouncedResizeHandler();
        });

        // Capture when a content type is duplicated within the container
        let duplicatedButton: ContentTypeInterface;
        let duplicatedButtonIndex: number;
        events.on("button-item:duplicateAfter", (args: ContentTypeDuplicateEventParamsInterface) => {
            if (this.contentType.id === args.duplicateContentType.parentContentType.id && args.direct) {
                duplicatedButton = args.duplicateContentType;
                duplicatedButtonIndex = args.index;
            }
        });
        events.on("button-item:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (duplicatedButton && args.id === duplicatedButton.id) {
                this.focusedButton(duplicatedButtonIndex);
            }
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
            title: $t("Add Button"),
            action: this.addButton,
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
     * Add button-item to buttons children array
     */
    public addButton() {
        const createButtonItemPromise: Promise<ContentTypeInterface> = createContentType(
            Config.getContentTypeConfig("button-item"),
            this.contentType,
            this.contentType.stageId,
            {},
        );

        createButtonItemPromise.then((button: ContentTypeInterface) => {
            this.contentType.addChild(button);
            const buttonIndex = this.contentType.children().indexOf(button);
            this.focusedButton(buttonIndex > -1 ? buttonIndex : null);
            return button;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    /**
     * Get the sortable options for the buttons sorting
     *
     * @param {string} orientation
     * @param {string} tolerance
     * @returns {JQueryUI.Sortable}
     */
    public getSortableOptions(
        orientation: string = "width",
        tolerance: string = "intersect",
    ): SortableOptionsInterface {
        return {
            handle: ".button-item-drag-handle",
            items: ".pagebuilder-content-type-wrapper",
            cursor: "grabbing",
            containment: "parent",
            tolerance,
            revert: 200,
            disabled: this.contentType.children().length <= 1,

            /**
             * Provide custom helper element
             *
             * @param {Event} event
             * @param {JQueryUI.Sortable} element
             * @returns {Element}
             */
            helper(event: Event, element: JQueryUI.Sortable): Element {
                const helper = $(element).clone().css({
                    opacity: "0.7",
                    width: "auto",
                });
                helper[0].querySelector(".pagebuilder-options").remove();
                return helper[0];
            },

            placeholder: {
                /**
                 * Provide custom placeholder element
                 *
                 * @param {JQuery} item
                 * @returns {JQuery}
                 */
                element(item: JQuery) {
                    const placeholder = item
                        .clone()
                        .css({
                            display: "inline-block",
                            opacity: "0.3",
                        })
                        .removeClass("focused")
                        .addClass("sortable-placeholder");
                    placeholder[0].querySelector(".pagebuilder-options").remove();
                    return placeholder[0];
                },
                update() {
                    return;
                },
            },

            /**
             * Trigger interaction start on sort
             */
            start() {
                events.trigger("stage:interactionStart");
            },

            /**
             * Stop stage interaction on stop
             */
            stop() {
                events.trigger("stage:interactionStop");
            },
        };
    }

    /**
     * Resize width of all child buttons. Dependently make them the same width if configured.
     */
    private resizeChildButtons() {
        if (this.wrapperElement) {
            const buttonItems: JQuery = $(this.wrapperElement).find(".pagebuilder-button-item > a");
            let buttonResizeValue: number = 0;
            if (this.contentType.dataStore.get("is_same_width") === "true") {
                if (buttonItems.length > 0) {
                    const currentLargestButtonWidth = this.findLargestButtonWidth(buttonItems);
                    const parentWrapperWidth = $(this.wrapperElement).find(".buttons-container").width();
                    if (currentLargestButtonWidth === 0) {
                        return;
                    }
                    buttonResizeValue = Math.min(currentLargestButtonWidth, parentWrapperWidth);
                }
            }
            buttonItems.css("min-width", buttonResizeValue);
        }
    }

    /**
     * Find the largest button width for calculating same size value.
     *
     * @param {JQuery} buttonItems
     * @returns {number}
     */
    private findLargestButtonWidth(buttonItems: JQuery): number {
        return _.max(_.map(buttonItems, (buttonItem) => this.calculateButtonWidth($(buttonItem))));
    }

    /**
     * Manually calculate button width using content plus box widths (padding, border)
     *
     * @param {JQuery} buttonItem
     * @returns {number}
     */
    private calculateButtonWidth(buttonItem: JQuery): number {
        if (buttonItem.is(":visible") === false) {
            return 0;
        }
        const widthProperties = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
        const buttonText = buttonItem.find("[data-element='link_text']");
        const textWidth = buttonText.css("display", "inline-block").width();
        buttonText.css("display", "");
        return widthProperties.reduce((accumulatedWidth, widthProperty): number => {
            return accumulatedWidth + (parseInt(buttonItem.css(widthProperty), 10) || 0);
        }, textWidth);
    }
}
