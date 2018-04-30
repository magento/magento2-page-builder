/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import renderer from 'Magento_Ui/js/lib/knockout/template/renderer';

/**
 * The hasFocusNoScroll binding allows inline editing.
 * Source: <Magento_Pagebuilder_module_dir>/view/adminhtml/web/js/binding/focus. See on Github.
 * Value type: Object.
 * Configuration for the hasFocusNoScroll widget.
 * Aliases: [pagebuilder-ko-hasFocusNoScroll]
 * Usage example:
 * <div pagebuilder-ko-hasFocusNoScroll="parent.parent.preview.focusedTab() === $index()"></div>
 */

ko.bindingHandlers.hasFocusNoScroll = {
    init: ko.bindingHandlers.hasFocus.init,
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        const value = !!ko.utils.unwrapObservable(valueAccessor());
        value ? element.focus({preventScroll: true}) : element.blur();
    },
};

renderer.addAttribute('hasFocusNoScroll', {
    name: 'pagebuilder-ko-hasFocusNoScroll'
});
