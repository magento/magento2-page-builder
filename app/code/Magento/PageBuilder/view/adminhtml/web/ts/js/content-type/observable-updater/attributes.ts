/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ContentTypeConfigAppearanceElementInterface} from "../../content-type-config.types";
import ConverterPool from "../../converter/converter-pool";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";

/**
 * Generate Knockout compatible bindings for the elements attribute binding
 *
 * @param elementName
 * @param config
 * @param data
 * @param converterResolver
 * @param converterPool
 */
export default function generate(
    elementName: string,
    config: ContentTypeConfigAppearanceElementInterface,
    data: DataObject,
    converterResolver: (config: object) => string,
    converterPool: typeof ConverterPool,
) {
    const attributeData: Record<string, string> = {};
    for (const attributeConfig of config.attributes) {
        if ("read" === attributeConfig.persistence_mode) {
            continue;
        }
        let value;
        if (!!attributeConfig.static) {
            value = attributeConfig.value;
        } else {
            value = get(data, attributeConfig.var);
        }
        const converter = converterResolver(attributeConfig);
        if (converterPool.get(converter)) {
            value = converterPool.get(converter).toDom(attributeConfig.var, data);
        }
        attributeData[attributeConfig.name] = value;
    }

    attributeData["data-element"] = elementName;
    return attributeData;
}
