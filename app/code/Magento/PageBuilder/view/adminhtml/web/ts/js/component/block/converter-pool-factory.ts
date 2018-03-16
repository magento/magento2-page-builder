/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import ConverterPool from "./converter-pool"
import appearanceConfig from "./appearance-config";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = appearanceConfig(contentType, undefined);

    const converterCodes = [];
    const converters = [];

    if (config.data_mapping !== undefined && config.data_mapping.converters !== undefined) {
        for (let i = 0; i < config.data_mapping.converters.length; i++) {
            let converter = config.data_mapping.converters[i];
            converterCodes.push(converter.name);
            converters.push(converter.component);
        }
    }

    return new Promise((resolve: (converterPool: object) => void) => {
        loadModule(converters, (...loadedConverters: any[]) => {
            const result = {};
            for (let i = 0; i < converterCodes.length; i++) {
                result[converterCodes[i]] = new loadedConverters[i]();
            }
            resolve(new ConverterPool(result));
        });
    });
}
