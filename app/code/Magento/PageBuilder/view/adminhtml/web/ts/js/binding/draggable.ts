/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import $ from "jquery";
import ko from "knockout";

/**
 * @api
 */
// Create a new sortable Knockout binding
ko.bindingHandlers.draggable = {
    init(element, valueAccessor) {
        $(element).draggable(valueAccessor());
    },
};
