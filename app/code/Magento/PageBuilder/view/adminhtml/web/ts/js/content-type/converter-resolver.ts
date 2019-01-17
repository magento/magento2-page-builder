/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataMappingInterface} from "../content-type-config.types";

/**
 * Resolve converter
 *
 * @param {DataMappingInterface} config
 * @return string
 */
export default function resolve(config: DataMappingInterface): string {
    return config.converter;
}
