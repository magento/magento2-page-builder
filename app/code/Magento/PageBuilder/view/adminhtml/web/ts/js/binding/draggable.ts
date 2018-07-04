/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
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
