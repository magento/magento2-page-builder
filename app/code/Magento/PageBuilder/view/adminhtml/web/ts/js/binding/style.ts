/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import utils from "mageUtils";
import _ from "underscore";
import {generateCssBlock} from "../content-type/style-registry";

const originalStyle: KnockoutBindingHandler = ko.bindingHandlers.style;

function isPageBuilderContext(context: {[key: string]: any}): boolean {
    return !!(context.stage && context.stage.pageBuilder);
}

ko.bindingHandlers.style = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        if (isPageBuilderContext(bindingContext)) {
            element.setAttribute("data-style-id", utils.uniqueid());
        }
    },
    update: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
        if (isPageBuilderContext(bindingContext)) {
            const value = ko.utils.unwrapObservable(valueAccessor() || {});
            const styles: { [key: string]: any; } = {};
            const className = "style-" + element.getAttribute("data-style-id");
            const existedStyleBlock = document.querySelector(`[data-selector="${className}"]`);

            ko.utils.objectForEach(value, (styleName, styleValue) => {
                styleValue = ko.utils.unwrapObservable(styleValue);

                if (styleValue === null || styleValue === undefined || styleValue === false) {
                    styleValue = "";
                }
                if (styleValue) {
                    styles[styleName] = styleValue;
                }
            });

            if (existedStyleBlock) {
                existedStyleBlock.remove();
            }
            if (!_.isEmpty(styles)) {
                const styleElement: HTMLStyleElement = document.createElement("style");

                styleElement.setAttribute("data-selector", className);
                styleElement.innerHTML = generateCssBlock(className, styles);
                element.classList.add(className);
                element.append(styleElement);
            }
        } else {
            originalStyle.update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }
    },
};
