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
        $(element).on("mousedown", () => {
            try {
                (document.activeElement as HTMLElement).blur();
            }
            catch (error) {
                console.error(error);
            }
        }).draggable(valueAccessor());
    },
};
