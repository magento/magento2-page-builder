/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
