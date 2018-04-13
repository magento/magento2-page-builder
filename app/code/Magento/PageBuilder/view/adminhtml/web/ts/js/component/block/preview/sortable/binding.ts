import $ from "jquery";
import ko from "knockout";
import {moveArrayItem} from "../../../../utils/array";
import EventBus from "../../../event-bus";
import Structural from "../../../stage/structural/abstract";

// Create a new sortable Knockout binding
ko.bindingHandlers.previewSortable = {

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
        const instance: Structural = context.$data;
        const options: JQueryUI.SortableOptions = ko.unwrap(valueAccessor());
        let originalPosition: number;
        $(element).sortable(options)
            .on("sortstart", (event: Event, ui: JQueryUI.SortableUIParams) => {
                originalPosition = ui.item.index();
                EventBus.trigger("previewSortable:sortstart", {
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
                    EventBus.trigger("previewSortable:sortupdate", {
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
    instance: Structural;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
}

export interface PreviewSortableSortUpdateEventParams {
    instance: Structural;
    newPosition: number;
    originalPosition: number;
    ui: JQueryUI.SortableUIParams;
}
