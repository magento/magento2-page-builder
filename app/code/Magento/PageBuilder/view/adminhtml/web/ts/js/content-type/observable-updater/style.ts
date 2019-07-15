/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import {ContentTypeConfigAppearanceElementInterface} from "../../content-type-config.types";
import ConverterPool from "../../converter/converter-pool";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";
import {fromSnakeToCamelCase} from "../../utils/string";

/**
 * Generate Knockout compatible bindings for the elements style binding
 *
 * @param elementName
 * @param config
 * @param data
 * @param converterResolver
 * @param converterPool
 * @param previousData
 */
export default function generate(
    elementName: string,
    config: ContentTypeConfigAppearanceElementInterface,
    data: DataObject,
    converterResolver: (config: object) => string,
    converterPool: typeof ConverterPool,
    previousData: Record<string, any>,
) {
    let newStyles: Record<string, string> = {};
    if (config.style) {
        for (const propertyConfig of config.style) {
            if ("read" === propertyConfig.persistence_mode) {
                continue;
            }
            let value: string | object;
            if (!!propertyConfig.static) {
                value = propertyConfig.value;
            } else {
                value = get(data, propertyConfig.var);
                const converter = converterResolver(propertyConfig);
                if (converterPool.get(converter)) {
                    value = converterPool.get(converter).toDom(propertyConfig.var, data);
                }
            }
            if (typeof value === "object") {
                _.extend(newStyles, value);
            } else if (value !== undefined) {
                newStyles[fromSnakeToCamelCase(propertyConfig.name)] = value;
            }
        }
    }

    if (previousData) {
        /**
         * If so we need to retrieve the previous styles applied to this element and create a new object
         * which forces all of these styles to be "false". Knockout doesn't clean existing styles when
         * applying new styles to an element. This resolves styles sticking around when they should be
         * removed.
         */
        const removeCurrentStyles = Object.keys(previousData)
            .reduce((object: object, styleName: string) => {
                return Object.assign(object, {[styleName]: ""});
            }, {});

        if (!_.isEmpty(removeCurrentStyles)) {
            newStyles = _.extend(removeCurrentStyles, newStyles);
        }
    }

    return newStyles;
}
