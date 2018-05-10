/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "uiEvents";
import ContentTypeInterface from "./content-type.d";
import {moveArrayItem} from "./utils/array";

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
                events.trigger("sortableChildren:sortstart", {
                    instance,
                    originalPosition,
                    ui,
                });
            })
            .on("sortupdate", (event: Event, ui: JQueryUI.SortableUIParams) => {
                const index = ui.item.index();
                if (originalPosition !== index) {
                    ui.item.remove();
                    moveArrayItem(instance.children, originalPosition, index);
                    events.trigger("sortableChildren:sortupdate", {
                        instance,
                        newPosition: index,
                        originalPosition,
                        ui,
                    });
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
