/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import {moveContentType} from "../drag-drop/move-content-type";
import {moveArrayItem} from "../utils/array";

let draggedContentType: ContentTypeCollectionInterface;

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
        const instance: ContentTypeCollectionInterface = context.$data.contentType;
        const options: JQueryUI.SortableOptions = ko.unwrap(valueAccessor());
        let originalPosition: number;
        $(element).sortable(options)
            .on("sortstart", (event: Event, ui: JQueryUI.SortableUIParams) => {
                originalPosition = ui.item.index();
                draggedContentType = instance.children()[originalPosition] as ContentTypeCollectionInterface;
                events.trigger("childContentType:sortStart", {
                    instance,
                    originalPosition,
                    ui,
                });
            })
            .on("sortstop", (event: JQueryEventObject, ui: JQueryUI.SortableUIParams) => {
                events.trigger("childContentType:sortStop", {
                    instance,
                    ui,
                    originalPosition,
                });
            })
            .on("sortupdate", function(event: JQueryEventObject, ui: JQueryUI.SortableUIParams) {
                if (this === ui.item.parent()[0]) {
                    const index = ui.item.index();
                    const targetParent = ko.dataFor(ui.item.parent()[0]).contentType;
                    if (targetParent &&
                        (originalPosition !== index || draggedContentType.parentContentType !== targetParent)
                    ) {
                        ui.item.remove();
                        if (draggedContentType.parentContentType === targetParent) {
                            moveArrayItem(instance.children, originalPosition, index);
                        } else {
                            moveContentType(draggedContentType, index, targetParent);
                        }
                        events.trigger("childContentType:sortUpdate", {
                            instance,
                            newPosition: index,
                            originalPosition,
                            ui,
                            event,
                        });
                    }
                }
            });
    },
};
