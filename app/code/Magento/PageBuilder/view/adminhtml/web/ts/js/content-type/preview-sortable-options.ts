/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import events from "uiEvents";
import {getDraggedBlockConfig} from "../panel/registry";
import Stage from "../stage";
import Preview from "./preview";

/**
 * Return the sortable options for an instance which requires sorting / dropping functionality
 *
 * @param {Preview} preview
 * @returns {JQueryUI.SortableOptions | any}
 */
export function getSortableOptions(preview: Preview | Stage): JQueryUI.SortableOptions | any {
    /**
     * @todo resolve issue with stage not conforming to the content type interface. e.g. not having a preview class
     * This corrects the paths to various things we require for the stage.
     */
    if (preview.config.name === "stage") {
        preview.stageId = (preview as Stage).id;
        preview = {
            canReceiveDrops: preview.canReceiveDrops,
            parent: preview,
        };
    }

    return {
        cursor: "-webkit-grabbing",
        helper(event: Event, item: Element) {
            return $(item).clone()[0];
        },
        appendTo: document.body,
        placeholder: {
            element() {
                return $("<div />").addClass("pagebuilder-sortable-placeholder")[0];
            },
            update() {
                return;
            },
        },
        handle: ".move-structural",
        items: "> .pagebuilder-content-type-wrapper",

        /**
         * Pass receive event through to handler with additional preview argument
         */
        receive() {
            onSortReceive.apply(this, [preview, ...arguments]);
        },
    };
}

/**
 * Handle receiving a block from the left panel
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSortReceive(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    // If the parent can't receive drops we need to cancel the operation
    if (!preview.canReceiveDrops()) {
        $(this).sortable("cancel");
        return;
    }

    const blockConfig = getDraggedBlockConfig();
    if (blockConfig) {
        // jQuery's index method doesn't work correctly here, so use Array.findIndex instead
        const index = $(event.target)
            .children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block")
            .toArray()
            .findIndex((element: Element) => {
                return element.classList.contains("pagebuilder-draggable-block");
            });

        // Fire the event to be handled by the stage
        events.trigger("block:dropped", {
            parent: preview.parent,
            stageId: preview.parent.stageId,
            blockConfig,
            index,
        });

        // Remove the DOM element, as this is a drop event we can't just remove the ui.item
        $(event.target).find(".pagebuilder-draggable-block").remove();
    }
}
