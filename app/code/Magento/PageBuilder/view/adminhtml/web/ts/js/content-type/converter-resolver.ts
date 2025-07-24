/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
