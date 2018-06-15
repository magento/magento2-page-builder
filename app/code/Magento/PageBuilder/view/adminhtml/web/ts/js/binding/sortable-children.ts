/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import ContentTypeInterface from "../content-type.d";
import {moveContentType} from "../drag-drop/move-content-type";
import {moveArrayItem} from "../utils/array";

let draggedContentType: ContentTypeInterface;

// Create a new sortable Knockout binding
ko.bindingHandlers.sortableChildren = {

    /**
     * Init the draggable binding on an element
     *
     * @param element
     * @param valueAccessor
     * @param allBindingsAccessor
     * @param data
     * @param context
     */
    init(element, valueAccessor, allBindingsAccessor, data, context: KnockoutBindingContext) {
        const instance: ContentTypeInterface = context.$data.parent;
        const options: JQueryUI.SortableOptions = ko.unwrap(valueAccessor());
        let originalPosition: number;
        $(element).sortable(options)
            .on("sortstart", (event: Event, ui: JQueryUI.SortableUIParams) => {
                originalPosition = ui.item.index();
                draggedContentType = instance.children()[originalPosition];
                events.trigger("sortableChildren:sortstart", {
                    instance,
                    originalPosition,
                    ui,
                });
            })
            .on("sortstop", (event: Event, ui: JQueryUI.SortableUIParams) => {
                events.trigger("sortableChildren:sortstop", {
                    instance,
                    ui,
                });
            })
            .on("sortupdate", function(event: Event, ui: JQueryUI.SortableUIParams) {
                if (this === ui.item.parent()[0]) {
                    const index = ui.item.index();
                    const targetParent = ko.dataFor(ui.item.parent()[0]).parent;
                    if (targetParent && (originalPosition !== index || draggedContentType.parent !== targetParent)) {
                        ui.item.remove();
                        if (draggedContentType.parent === targetParent) {
                            moveArrayItem(instance.children, originalPosition, index);
                        } else {
                            moveContentType(draggedContentType, index, targetParent);
                        }
                        events.trigger("sortableChildren:sortupdate", {
                            instance,
                            newPosition: index,
                            originalPosition,
                            ui,
                        });
                    }
                }
            });
    },
};

export interface PreviewSortableSortStartEventParams {
    instance: ContentTypeInterface;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
}

export interface PreviewSortableSortUpdateEventParams {
    instance: ContentTypeInterface;
    newPosition: number;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
}
