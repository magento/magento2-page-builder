/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import _ from "underscore";
import Config from "../config";
import ContentTypeInterface from "../content-type";
import ContentTypeCollectionInterface from "../content-type-collection";
import ContentTypeConfigInterface from "../content-type-config";
import createContentType from "../content-type-factory";
import Preview from "../content-type/preview";
import {getDraggedBlockConfig, setDraggedBlockConfig} from "../panel/registry";
import Stage from "../stage";
import {createStyleSheet} from "../utils/create-stylesheet";
import {createAllowedContainersGenerator} from "./allowed-containers-factory";
import {AllowedContainersGenerator} from "./allowed-containers.d";

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
        tolerance: "pointer",
        helper(event: Event, item: Element) {
            const helper = $(item).clone();
            helper.css({
                pointerEvents: "none",
            });
            return helper[0];
        },
        appendTo: document.body,
        containment: "document",
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
        createContentType(blockConfig, preview.parent, preview.parent.stageId)
            .then((block: ContentTypeInterface) => {
                (preview.parent as ContentTypeCollectionInterface).addChild(block, index);
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
            const targetParent: ContentTypeCollectionInterface = target.parent;

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

/**
 * Move a content type to a new index, with the option to move to a new container
 *
 * @param {ContentType} contentType
 * @param {number} targetIndex
 * @param {ContentTypeCollection} targetParent
 */
export function moveContentType(
    contentType: ContentTypeInterface,
    targetIndex: number,
    targetParent: ContentTypeCollectionInterface = null,
) {
    const sourceParent: ContentTypeCollectionInterface = (contentType.parent as ContentTypeCollectionInterface);
    const sourceIndex = (contentType.parent as ContentTypeCollectionInterface)
        .children()
        .indexOf(contentType);
    const sourceParentChildren = sourceParent.getChildren();

    if (targetParent && sourceParent !== targetParent) {
        contentType.parent = targetParent;
        // Handle dragging between sortable elements
        sourceParentChildren.splice(sourceIndex, 1);
        targetParent.getChildren().splice(targetIndex, 0, contentType);
    } else {
        // Retrieve the children from the source parent
        const children = ko.utils.unwrapObservable(sourceParentChildren);

        // Inform KO that this value is about to mutate
        if (sourceParentChildren.valueWillMutate) {
            sourceParentChildren.valueWillMutate();
        }

        // Perform the mutation
        children.splice(sourceIndex, 1);
        children.splice(targetIndex, 0, contentType);

        // Inform KO that the mutation is complete
        if (sourceParentChildren.valueHasMutated) {
            sourceParentChildren.valueHasMutated();
        }
    }

    // Process any deferred bindings
    if (ko.processAllDeferredBindingUpdates) {
        ko.processAllDeferredBindingUpdates();
    }

    // @todo fire generic move event
}

let headDropIndicatorStyles: HTMLStyleElement;

/**
 * Show the drop indicators for a specific content type
 *
 * We do this by creating a style sheet and injecting it into the head. It's dramatically quicker to allow the browsers
 * CSS engine to display these for us than manually iterating through the DOM and applying a class to the elements.
 *
 * @param {string} contentType
 * @returns {HTMLStyleElement}
 */
export function showDropIndicators(contentType: string) {
    const acceptedContainers = getContainersFor(contentType);
    if (acceptedContainers.length > 0) {
        const classNames = acceptedContainers.map((container: string) => {
            return ".content-type-container." + container + "-container > .pagebuilder-drop-indicator";
        });
        const styles = createStyleSheet({
            [classNames.join(", ")]: {
                opacity: 1,
                visibility: "visible",
            },
        });
        document.head.appendChild(styles);
        headDropIndicatorStyles = styles;
        return styles;
    }
}

/**
 * Hide the drop indicators
 */
export function hideDropIndicators() {
    if (headDropIndicatorStyles) {
        headDropIndicatorStyles.remove();
        headDropIndicatorStyles = null;
    }
}

export interface AcceptedMatrix {
    [key: string]: string[];
}

const acceptedMatrix: AcceptedMatrix = {};

/**
 * Build a matrix of which containers each content type can go into, these are determined by the allowed_parents
 * node within the content types configuration
 */
export function generateContainerAcceptedMatrix(): void {
    _.values(Config.getConfig("content_types")).forEach((contentType: ContentTypeConfigInterface) => {
        acceptedMatrix[contentType.name] = contentType.allowed_parents.slice();
    });
}

/**
 * Retrieve the containers a specific content type can be contained in
 *
 * @param {string} contentType
 * @returns {any}
 */
export function getContainersFor(contentType: string): string[] {
    if (acceptedMatrix[contentType]) {
        return acceptedMatrix[contentType];
    }

    return [];
}

/**
 * Generate classes of containers the content type is allowed within
 *
 * @param {string} contentType
 * @returns {string}
 */
export function getAllowedContainersClasses(contentType: string) {
    return getContainersFor(contentType)
        .map((value) => ".content-type-container." + value + "-container").join(", ");
}
