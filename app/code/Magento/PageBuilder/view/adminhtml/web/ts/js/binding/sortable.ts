/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import _ from "underscore";

// Create a new sortable Knockout binding
ko.bindingHandlers.sortable = {
    init(element, valueAccessor) {
        // As we can't conditionally apply bindings we block this operation when options are null
        if (valueAccessor() === null) {
            return;
        }

        _.defer(() => {
            $(element).sortable(valueAccessor());
        });
    },
};
