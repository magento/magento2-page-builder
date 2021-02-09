/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import {ContentTypeConfigAppearanceElementInterface} from "../../content-type-config.types";
import ConverterPool from "../../converter/converter-pool";
import {DataObject} from "../../data-store";
import { replaceWithDataSrc } from "../../utils/directives";
import {processInlineStyles} from "../../utils/editor";
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

    // Replacing src attribute with data-tmp-src to prevent img requests in iframe during master format rendering
    if (Config.getMode() !== "Preview" && typeof value === "string" && value.indexOf("{{media url=") !== -1) {
        value = replaceWithDataSrc(value);
    }

    // Process all desktop styles that left unprocessed after migrating from inline styles.
    if (typeof value === "string") {
        value = processInlineStyles(value);
    }

    return value;
}
