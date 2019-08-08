/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ContentTypeConfigAppearanceElementInterface} from "../../content-type-config.types";
import ConverterPool from "../../converter/converter-pool";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";

/**
 * Generate Knockout compatible bindings for the elements html binding
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
    let value = config.html.var ? get(data, config.html.var, config.html.placeholder) : config.html.placeholder;
    const converter = converterResolver(config.html);
    if (converterPool.get(converter)) {
        value = converterPool.get(converter).toDom(config.html.var, data);
    }
    // if value is empty, use placeholder
    if (typeof value === "string" && !value.length && config.html.placeholder) {
        value = config.html.placeholder;
    }
    return value;
}
