/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import utils from "mageUtils";
import _ from "underscore";
import Config from "../config";
import {getStyleRegistry, pbStyleAttribute} from "../content-type/style-registry";

const bodyId: string = Config.getConfig("bodyId");
const getStyles = (styleObject: {[key: string]: any}) => {
    const styles: { [key: string]: any; } = {};

    ko.utils.objectForEach(styleObject, (styleName, styleValue) => {
        styleValue = ko.utils.unwrapObservable(styleValue);

        if (styleValue === null || styleValue === undefined || styleValue === false) {
            // Empty string removes the value, whereas null/undefined have no effect
            styleValue = "";
        }
        if (styleValue) {
            styles[styleName] = styleValue;
        }
    });

    return styles;
};

ko.bindingHandlers.style = {
    update: (element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) => {
        const value = ko.utils.unwrapObservable(valueAccessor() || {});
        const viewportKeys: string[] = _.keys(Config.getConfig("viewports"));
        const commonStyles: { [key: string]: any; } = getStyles(_.omit(value, viewportKeys));
        const viewportStyles: { [key: string]: any; } = {};

        _.each(viewportKeys, (name: string) => {
            viewportStyles[name] = _.extend(getStyles(value[name]), commonStyles);
        });

        if (_.findKey(viewportStyles, (styles) => !_.isEmpty(styles))) {
            const id = utils.uniqueid();
            const selector = `#${bodyId} [${pbStyleAttribute}="${id}"]`;

            _.each(viewportKeys, (name: string) => {
                const registry = getStyleRegistry(name + bindingContext.$root.id);

                registry.setStyles(selector, viewportStyles[name]);
            });

            element.setAttribute(pbStyleAttribute, id);
        }

    },
};
