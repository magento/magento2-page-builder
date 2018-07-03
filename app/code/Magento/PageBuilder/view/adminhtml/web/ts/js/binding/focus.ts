/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
/**
 * @api
 */
ko.bindingHandlers.hasFocusNoScroll = {
    init: ko.bindingHandlers.hasFocus.init,
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        const value = !!ko.utils.unwrapObservable(valueAccessor());
        value ? element.focus({preventScroll: true}) : element.blur();
    },
};
