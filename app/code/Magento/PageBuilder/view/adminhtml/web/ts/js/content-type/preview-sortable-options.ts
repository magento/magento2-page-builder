/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $ from "jquery";
import events from "uiEvents";
import _ from "underscore";
import Config from "../config";
import ContentTypeConfigInterface from "../content-type-config";
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

interface AcceptedMatrix {
    [key: string]: string[];
}

const acceptedMatrix: AcceptedMatrix = {};

/**
 * Build a matrix of which containers each content type can go into, these are calculated by the type given to the
 * content type in it's declaration.
 *
 * Types:
 * static - can go into any container (not into restricted containers)
 * container - can contain any static item
 * restricted-static - can only go into containers which declare it <accepts /> them
 * restricted-container - can only contain items which it declares it <accepts />
 */
export function generateContainerAcceptedMatrix(): void {
    const contentTypes = [
        // @todo move stage config into XML
        {
            name: "stage",
            type: "restricted-container",
            accepts: [
                "row",
            ],
        },
        ..._.values(Config.getConfig("content_types")),
    ];

    // Retrieve all containers
    const containers = contentTypes.filter((config: ContentTypeConfigInterface) => {
        return config.type === "container";
    }).map((config: ContentTypeConfigInterface) => {
        return config.name;
    });

    contentTypes.forEach((contentType: ContentTypeConfigInterface) => {
        // Iterate over restricted containers to calculate their allowed children first
        if (contentType.accepts && contentType.accepts.length > 0) {
            contentType.accepts.forEach((accepted: string) => {
                if (!acceptedMatrix[accepted]) {
                    acceptedMatrix[accepted] = [];
                }
                acceptedMatrix[accepted].push(contentType.name);
            });
        }

        // Any static / restricted-container content type can go in all unrestricted containers
        if (contentType.type === "static" || contentType.type === "restricted-container") {
            if (!acceptedMatrix[contentType.name]) {
                acceptedMatrix[contentType.name] = [];
            }
            acceptedMatrix[contentType.name] = acceptedMatrix[contentType.name].concat(containers);
        }
    });
}

/**
 * Retrieve the containers a specific content type can be contained in
 *
 * @param {string} contentType
 * @returns {any}
 */
export function getContainersFor(contentType: string) {
    if (acceptedMatrix[contentType]) {
        return acceptedMatrix[contentType];
    }

    return null;
}
