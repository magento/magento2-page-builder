/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import {SortableOptionsInterface} from "../../binding/sortable-options";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import StageUpdateAfterParamsInterface from "../../stage-update-after-params.d";
import ContentTypeAfterRenderEventParamsInterface from "../content-type-after-render-event-params.d";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params.d";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);
    public currentMaxWidth: KnockoutObservable<number> = ko.observable(0);
    /**
     * Keeps track of number of button item to disable sortable if there is only 1.
     */
    public disableSorting: KnockoutComputed<void> = ko.computed(() => {
        const sortableElement = $(this.wrapperElement).find(".buttons-container");
        if (this.parent.children().length <= 1) {
            sortableElement.sortable("disable");
        } else {
            sortableElement.sortable("enable");
        }
    });

    public bindEvents() {
        super.bindEvents();

        events.on("buttons:dropAfter", (args: ContentTypeDroppedCreateEventParamsInterface) => {
            if (args.id === this.parent.id && this.parent.children().length === 0) {
                this.addButton();
            }
        });

        events.on("buttons:renderAfter", (eventData: ContentTypeAfterRenderEventParamsInterface) => {
            if (eventData.contentType.id === this.parent.id) {
                this.resizeChildButtons();
            }
        });

        events.on("button-item:renderAfter", (eventData: ContentTypeAfterRenderEventParamsInterface) => {
            if (eventData.contentType.parent.id === this.parent.id) {
                this.resizeChildButtons();
            }
        });

        events.on("stage:updateAfter", (eventData: StageUpdateAfterParamsInterface) => {
            _.debounce(() => {
                this.resizeChildButtons();
            }, 500).call(this);
        });
    }

    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOver(context: Preview, event: Event): void {
        // Only run the mouse over action when the active element is not a child of buttons
        if (!$.contains(this.wrapperElement, document.activeElement)) {
            return super.onMouseOver(context, event);
        }
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
                $t("Add Button"),
                this.addButton,
                ["add-child"],
                20,
            ),
        );
        return options;
    }

    /**
     * Add button-item to buttons children array
     */
    public addButton() {
        const createButtonItemPromise: Promise<ContentTypeInterface> = createContentType(
            Config.getContentTypeConfig("button-item"),
            this.parent.parent,
            this.parent.stageId,
            {},
        );

        createButtonItemPromise.then((button: ContentTypeInterface) => {
            this.parent.addChild(button);
            this.isLiveEditing(this.parent.children().indexOf(button) !== -1);
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
    public buttonsSortableOptions(
        orientation: string = "width",
        tolerance: string = "intersect",
    ): SortableOptionsInterface {
        let placeholderGhost: JQuery;
        return {
            handle: ".button-item-drag-handle",
            items: ".pagebuilder-content-type-wrapper",
            cursor: "grabbing",
            containment: "parent",
            tolerance,
            revert: 200,
            cursorAt: { left: 15, top: 15 },
            disabled: this.parent.children().length <= 1,
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
                            opacity: 0,
                            width: item.width(),
                            height: item.height(),
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
             * Logic for starting the sorting and adding the placeholderGhost
             *
             * @param {Event} event
             * @param {JQueryUI.SortableUIParams} element
             */
            start(event: Event, element: JQueryUI.SortableUIParams) {
                placeholderGhost = element.placeholder
                    .clone()
                    .css({
                        opacity: 0.3,
                        position: "absolute",
                        left: element.placeholder.position().left,
                        top: element.placeholder.position().top,
                    });
                element.item.parent().append(placeholderGhost);
                events.trigger("stage:interactionStart");
            },
            /**
             * Logic for changing element position
             *
             * Set the width and height of the moving placeholder animation
             * and then add animation of placeholder ghost to the placeholder position.
             *
             * @param {Event} event
             * @param {JQueryUI.SortableUIParams} element
             */
            change(event: Event, element: JQueryUI.SortableUIParams) {
                element.placeholder.stop(true, false);
                if (orientation === "height") {
                    element.placeholder.css({height: element.item.height() / 1.2});
                    element.placeholder.animate({height: element.item.height()}, 200, "linear");
                }
                if (orientation === "width") {
                    element.placeholder.css({width: element.item.width() / 1.2});
                    element.placeholder.animate({width: element.item.width()}, 200, "linear");
                }
                placeholderGhost.stop(true, false).animate({
                    left: element.placeholder.position().left,
                    top: element.placeholder.position().top,
                }, 200);
            },
            /**
             * Logic for post sorting and removing the placeholderGhost
             */
            stop(event: Event, element: JQueryUI.SortableUIParams) {
                placeholderGhost.remove();
                element.item.find(".pagebuilder-content-type-active").removeClass("pagebuilder-content-type-active");
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
            let buttonResizeValue: string|number = "";
            if (this.parent.dataStore.get("is_same_width") === "true") {
                if (buttonItems.length > 0) {
                    buttonItems.css("min-width", "");
                    const currentLargestButton = this.findLargestButton(buttonItems);
                    const currentLargestButtonWidth = currentLargestButton.outerWidth();
                    if (currentLargestButtonWidth !== 0) {
                        buttonResizeValue = currentLargestButtonWidth;
                        this.currentMaxWidth(currentLargestButtonWidth);
                    } else {
                        buttonResizeValue = this.currentMaxWidth();
                    }
                }
            }
            buttonItems.css("min-width", buttonResizeValue);
        }
    }

    /**
     * Find the largest button which will determine the button width we use for re-sizing.
     *
     * @param {JQuery} buttonItems
     * @returns {JQuery}
     */
    private findLargestButton(buttonItems: JQuery): JQuery {
        let largestButton: JQuery|null = null;
        buttonItems.each((index, element) => {
            const buttonElement = $(element);
            if (largestButton === null
                || this.calculateButtonWidth(buttonElement) > this.calculateButtonWidth(largestButton)) {
                largestButton = buttonElement;
            }
        });
        return largestButton;
    }

    /**
     * Manually calculate button width using content plus box widths (padding, border)
     *
     * @param {JQuery} buttonItem
     * @returns {number}
     */
    private calculateButtonWidth(buttonItem: JQuery): number {
        const widthProperties = ["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"];
        const calculatedButtonWidth: number = widthProperties.reduce((accumulatedWidth, widthProperty): number => {
            return accumulatedWidth + (parseInt(buttonItem.css(widthProperty), 10) || 0);
        }, buttonItem.find("[data-element='link_text']").width());
        return calculatedButtonWidth;
    }
}
