/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import ContentTypeInterface from "../content-type";
import ContentTypeCollectionInterface from "../content-type-collection";
import createContentType from "../content-type-factory";
import Preview from "../content-type/preview";
import {getDraggedBlockConfig, setDraggedBlockConfig} from "../panel/registry";
import Stage from "../stage";
import {hideDropIndicators, showDropIndicators} from "./drop-indicators";
import {getAllowedContainersClasses} from "./matrix";
import {moveContentType} from "./move-content-type";

/**
 * Return the sortable options for an instance which requires sorting / dropping functionality
 *
 * @param {Preview} preview
 * @returns {JQueryUI.SortableOptions | any}
 */
export function getSortableOptions(preview: Preview | Stage): JQueryUI.SortableOptions | any {
    return {
        cursor: "-webkit-grabbing",
        tolerance: "pointer",
        helper(event: Event, item: Element) {
            const helper = $(item).clone();
            helper.css({
                pointerEvents: "none",
            });
            return helper[0];
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
        start() {
            onSortStart.apply(this, [preview, ...arguments]);
        },
        sort() {
            onSort.apply(this, [preview, ...arguments]);
        },
        receive() {
            onSortReceive.apply(this, [preview, ...arguments]);
        },
        update() {
            onSortUpdate.apply(this, [preview, ...arguments]);
        },
        stop() {
            onSortStop.apply(this, [preview, ...arguments]);
        },
    };
}

/**
 * Get the stage ID from the preview
 *
 * @param {Preview | Stage} preview
 * @returns {string}
 */
function getPreviewStageIdProxy(preview: Preview | Stage): string {
    if (preview.config.name === "stage") {
        return (preview as Stage).id;
    }
    return (preview.parent as ContentTypeInterface).stageId;
}

/**
 * Retrieve the parent from the preview
 *
 * @param {Preview | Stage | ContentTypeInterface} instance
 * @returns {any}
 */
function getParentProxy(instance: Preview | Stage | ContentTypeInterface): ContentTypeCollectionInterface {
    if (instance.config.name === "stage") {
        // @todo our usage of types for Stage are wrong, this requires refactoring outside of the scope of this story
        return (instance as any);
    }
    return (instance.parent as ContentTypeCollectionInterface);
}

let sortedContentType: ContentTypeInterface;

/**
 * On sort start record the item being sorted
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSortStart(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    // Verify we're sorting an already created item
    if (ui.item.hasClass("pagebuilder-content-type-wrapper")) {
        events.trigger("interaction:start");
        const contentTypeInstance: ContentTypeInterface = ko.dataFor(ui.item[0]);
        if (contentTypeInstance) {
            // Ensure the original item is displayed but with reduced opacity
            ui.item.show().addClass("pagebuilder-sorting-original");

            sortedContentType = contentTypeInstance;
            showDropIndicators(contentTypeInstance.config.name);

            // Dynamically change the connect with option to restrict content types
            $(this).sortable("option", "connectWith", getAllowedContainersClasses(contentTypeInstance.config.name));
            $(this).sortable("refresh");
        }
    }
}

/**
 * On a sort action hide the placeholder if disabled
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSort(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    if ($(this).sortable("option", "disabled")) {
        ui.placeholder.hide();
    } else {
        ui.placeholder.show();
    }
}

/**
 * On sort stop hide any indicators
 */
function onSortStop(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    sortedContentType = null;
    ui.item.removeClass("pagebuilder-sorting-original");
    hideDropIndicators();
    setDraggedBlockConfig(null);
    events.trigger("interaction:stop");
}

/**
 * Handle receiving a block from the left panel
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSortReceive(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    if ($(event.target)[0] !== this) {
        return;
    }

    // If the sortable instance is disabled don't complete this operation
    if ($(this).sortable("option", "disabled")) {
        return;
    }

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

        // Create the new content type and insert it into the parent
        createContentType(blockConfig, getParentProxy(preview), getPreviewStageIdProxy(preview))
            .then((block: ContentTypeInterface) => {
                getParentProxy(preview).addChild(block, index);
                events.trigger("block:dropped:create", {id: block.id, block});
                events.trigger(blockConfig.name + ":block:dropped:create", {id: block.id, block});
                return block;
            });

        // Remove the DOM element, as this is a drop event we can't just remove the ui.item
        $(event.target).find(".pagebuilder-draggable-block").remove();
    }
}

/**
 * On sort update handle sorting the underlying children knockout list
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSortUpdate(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    // If the sortable instance is disabled don't complete this operation
    if ($(this).sortable("option", "disabled")) {
        ui.item.remove();
        return;
    }

    if (sortedContentType && (this === ui.item.parent()[0])) {
        const el = ui.item[0];
        const contentTypeInstance = ko.dataFor(el);
        const target = ko.dataFor(ui.item.parents(".content-type-container")[0]);

        if (target && contentTypeInstance) {
            // Calculate the source and target index
            const sourceParent: ContentTypeCollectionInterface = contentTypeInstance.parent;
            const targetParent: ContentTypeCollectionInterface = getParentProxy(target);

            const targetIndex = $(event.target)
                .children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-block")
                .toArray()
                .findIndex((element: Element) => {
                    return element === el;
                });

            if (sourceParent) {
                $(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
            } else {
                $(el).remove();
            }

            moveContentType(contentTypeInstance, targetIndex, targetParent);

            if (contentTypeInstance.parent !== targetParent) {
                ui.item.remove();
            }
        }
    }
}
