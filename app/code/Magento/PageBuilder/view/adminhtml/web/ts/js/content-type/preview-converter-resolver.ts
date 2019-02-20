/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataMappingStyleInterface} from "../content-type-config.types";

/**
 * Resolve converter
 *
 * @param {DataMappingStyleInterface} config
 * @return string
 */
export default function resolve(config: DataMappingStyleInterface): string {
    return config.preview_converter ? config.preview_converter : config.converter;
}
