/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import utils from "mageUtils";
import _ from "underscore";
import {getStyleRegistry} from "../content-type/style-registry";

ko.bindingHandlers.style = {
    update: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
        const value = ko.utils.unwrapObservable(valueAccessor() || {});
        const styles: { [key: string]: any; } = {};

        ko.utils.objectForEach(value, (styleName, styleValue) => {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }
            if (styleValue) {
                styles[styleName] = styleValue;
            }
        });

        if (!_.isEmpty(styles)) {
            const className = "style-" + utils.uniqueid();
            const registry = getStyleRegistry(bindingContext.$root.id);

            registry.setStyles(className, styles);
            element.classList.add(className);
        }

    },
};
