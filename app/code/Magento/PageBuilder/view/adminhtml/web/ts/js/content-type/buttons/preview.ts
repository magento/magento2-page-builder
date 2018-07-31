/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import {SortableOptionsInterface} from "../../binding/sortable-options";
import Config from "../../config";
import ContentTypeInterface from "../../content-type";
import createContentType from "../../content-type-factory";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeDroppedCreateEventParamsInterface from "../content-type-dropped-create-event-params";
import PreviewCollection from "../preview-collection";

/**
 * @api
 */
export default class Preview extends PreviewCollection {
    public isLiveEditing: KnockoutObservable<boolean> = ko.observable(false);
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
    }

    /**
     * Set state based on mouseover event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onMouseOver(context: Preview, event: Event) {
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
     * Get the sortable options for the tab heading sorting
     *
     * @returns {JQueryUI.SortableOptions}
     */
    public getSortableOptions(): SortableOptionsInterface {
        return {
            handle: ".button-item-drag-handle",
            items: ".pagebuilder-content-type-wrapper",
            containment: "parent",
            tolerance: "pointer",
            cursor: "grabbing",
            cursorAt: { left: 25, top: 25 },
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
                        .show()
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
        };
    }
}
