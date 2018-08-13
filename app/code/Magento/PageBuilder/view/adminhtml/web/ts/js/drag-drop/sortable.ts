/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import ContentTypeInterface from "../content-type";
import ContentTypeCollectionInterface from "../content-type-collection";
import createContentType from "../content-type-factory";
import Preview from "../content-type/preview";
import Stage from "../stage";
import {bindAfterRenderForAnimation, lockContainerHeight} from "./container-animation";
import {hideDropIndicators, showDropIndicators} from "./drop-indicators";
import {getAllowedContainersClasses} from "./matrix";
import {moveContentType} from "./move-content-type";
import {getDraggedContentTypeConfig, setDraggedContentTypeConfig} from "./registry";

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
 * @param {Preview | Stage} instance
 * @returns {any}
 */
function getParentProxy(instance: Preview | Stage): ContentTypeCollectionInterface {
    if (instance.config.name === "stage") {
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
        events.trigger("stage:interactionStart");
        const contentTypeInstance: ContentTypeInterface = ko.dataFor(ui.item[0]);
        if (contentTypeInstance) {
            // Ensure the original item is displayed but with reduced opacity
            ui.item.show().addClass("pagebuilder-sorting-original");

            $(".pagebuilder-drop-indicator.hidden-drop-indicator").show().removeClass("hidden-drop-indicator");

            // If we're the first item in the container we need to hide the first drop indicator
            if ((contentTypeInstance.parent as ContentTypeCollectionInterface)
                    .getChildren().indexOf(contentTypeInstance) === 0) {
                ui.item.prev(".pagebuilder-drop-indicator").hide().addClass("hidden-drop-indicator");
            }

            sortedContentType = contentTypeInstance;
            showDropIndicators(contentTypeInstance.config.name);

            // Dynamically change the connect with option to restrict content types
            $(this).sortable("option", "connectWith", getAllowedContainersClasses(contentTypeInstance.config.name));
            $(this).sortable("refresh");
        }
    }
}

let placeholderContainer: Element;

/**
 * On a sort action hide the placeholder if disabled
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSort(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    if ($(this).sortable("option", "disabled") ||
        ui.placeholder.parents(".pagebuilder-content-type-hidden").length > 0
    ) {
        ui.placeholder.hide();
    } else {
        ui.placeholder.show();
    }

    /**
     * We record the position of the placeholder on sort so we can ensure we place the content type in the correct place
     * as jQuery UI's events aren't reliable.
     */
    placeholderContainer = ui.placeholder.parents(".content-type-container")[0];
}

/**
 * On sort stop hide any indicators
 */
function onSortStop(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    sortedContentType = null;
    ui.item.removeClass("pagebuilder-sorting-original");
    hideDropIndicators();
    setDraggedContentTypeConfig(null);

    // Only trigger stop if we triggered start
    if (ui.item.hasClass("pagebuilder-content-type-wrapper")) {
        events.trigger("stage:interactionStop");
    }

    if (ui.item) {
        ui.item.remove();
    }
}

/**
 * Handle receiving a content type from the left panel
 *
 * @param {Preview} preview
 * @param {Event} event
 * @param {JQueryUI.SortableUIParams} ui
 */
function onSortReceive(preview: Preview, event: Event, ui: JQueryUI.SortableUIParams) {
    if ($(event.target)[0] !== this) {
        return;
    }

    // If the parent can't receive drops we need to cancel the operation
    if (!preview.isContainer()) {
        $(this).sortable("cancel");
        return;
    }

    const contentTypeConfig = getDraggedContentTypeConfig();
    if (contentTypeConfig) {
        // If the sortable instance is disabled don't complete this operation
        if ($(this).sortable("option", "disabled") || $(this).parents(".pagebuilder-content-type-hidden").length > 0) {
            return;
        }

        // jQuery's index method doesn't work correctly here, so use Array.findIndex instead
        const index = $(event.target)
            .children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-content-type")
            .toArray()
            .findIndex((element: Element) => {
                return element.classList.contains("pagebuilder-draggable-content-type");
            });

        const parentContainerElement = $(event.target).parents(".type-container");
        const containerLocked = getParentProxy(preview).getChildren()().length === 0 &&
            lockContainerHeight(parentContainerElement);

        // Create the new content type and insert it into the parent
        createContentType(contentTypeConfig, getParentProxy(preview), getPreviewStageIdProxy(preview))
            .then((contentType: ContentTypeInterface) => {
                // Prepare the event handler to animate the container height on render
                bindAfterRenderForAnimation(containerLocked, contentType, parentContainerElement);

                getParentProxy(preview).addChild(contentType, index);
                events.trigger("contentType:dropAfter", {id: contentType.id, contentType});
                events.trigger(
                    contentTypeConfig.name + ":dropAfter",
                    {
                        id: contentType.id,
                        contentType,
                    },
                );

                return contentType;
            });

        // Remove the DOM element, as this is a drop event we can't just remove the ui.item
        $(event.target).find(".pagebuilder-draggable-content-type").remove();
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
    if ($(this).sortable("option", "disabled") || ui.item.parents(".pagebuilder-content-type-hidden").length > 0) {
        ui.item.remove();
        $(this).sortable("cancel");

        // jQuery tries to reset the state but kills KO's bindings, so we'll force a re-render on the parent
        if (ui.item.length > 0 && typeof ko.dataFor(ui.item[0]) !== "undefined") {
            const parent = ko.dataFor(ui.item[0]).parent as ContentTypeCollectionInterface;
            const children = parent.getChildren()().splice(0);
            parent.getChildren()([]);
            parent.getChildren()(children);
        }
        return;
    }

    /**
     * Validate the event is coming from the exact instance or a child instance, we validate on the child instance
     * as the event is sometimes annoyingly caught by the parent rather than the child it's dropped into. Combining this
     * with placeholderContainer logic we can ensure we always do the right operation.
     */
    if (
        sortedContentType &&
        (this === ui.item.parent()[0] || (placeholderContainer && $(this).find(ui.item.parent()).length > 0))
    ) {
        const el = ui.item[0];
        const contentTypeInstance = ko.dataFor(el);
        const target = ko.dataFor(placeholderContainer);

        if (target && contentTypeInstance) {
            // Calculate the source and target index
            const sourceParent: ContentTypeCollectionInterface = contentTypeInstance.parent;
            const targetParent: ContentTypeCollectionInterface = getParentProxy(target);

            const targetIndex = $(placeholderContainer)
                .children(".pagebuilder-content-type-wrapper, .pagebuilder-draggable-content-type")
                .toArray()
                .findIndex((element: Element) => {
                    return element === el;
                });

            if (sourceParent) {
                $(sourceParent === targetParent ? this : ui.sender || this).sortable("cancel");
            } else {
                $(el).remove();
            }

            const parentContainerElement = $(event.target).parents(".type-container");
            const parentContainerLocked = targetParent.getChildren()().length === 0 &&
                lockContainerHeight(parentContainerElement);

            // Bind the event handler before the move operation
            bindAfterRenderForAnimation(parentContainerLocked, contentTypeInstance, parentContainerElement);

            // Also check if we need to handle animations on the source container
            if (sourceParent.preview && sourceParent.preview.wrapperElement) {
                const sourceContainerElement = $(sourceParent.preview.wrapperElement);
                const sourceContainerLocked = sourceParent.getChildren()().length === 1 &&
                    lockContainerHeight(sourceContainerElement);
                bindAfterRenderForAnimation(sourceContainerLocked, contentTypeInstance, sourceContainerElement);
            }

            moveContentType(contentTypeInstance, targetIndex, targetParent);

            if (contentTypeInstance.parent !== targetParent) {
                ui.item.remove();
            }
        }
    }
}
