/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ContentTypeConfigAppearanceElementInterface} from "../../content-type-config.types";
import ConverterPool from "../../converter/converter-pool";
import {DataObject} from "../../data-store";
import {get} from "../../utils/object";

/**
 * Generate Knockout compatible bindings for the elements css binding
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
    previousData: Record<string, boolean>,
) {
    const css = get<string>(data, config.css.var);
    const newClasses: Record<string, boolean> = {};

    if (css && css.length > 0) {
        css.toString().split(" ").map(
            (value: string) => newClasses[value] = true,
        );
    }
    for (const className of Object.keys(previousData)) {
        if (!(className in newClasses)) {
            newClasses[className] = false;
        }
    }

    return newClasses;
}
