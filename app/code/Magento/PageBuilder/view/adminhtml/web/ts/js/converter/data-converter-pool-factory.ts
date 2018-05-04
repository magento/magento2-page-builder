/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/loader";
import Config from "../config";
import DataConverterPool from "./data-converter-pool";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentTypeConfig(contentType);
    const converters = [];
    for (const appearanceName: string of Object.keys(config.appearances)) {
        const dataMapping = config.appearances[appearanceName].data_mapping;
        if (undefined !== dataMapping && undefined !== dataMapping.converters) {
            for (const converterConfig of dataMapping.converters) {
                if (!!converterConfig.component && !DataConverterPool.get(converterConfig.component)) {
                    converters.push(converterConfig.component);
                }
            }
        }
    }

    return new Promise((resolve: (elementConverterPool: object) => void) => {
        loadModule(converters, (...loadedConverters: any[]) => {
            for (let i = 0; i < converters.length; i++) {
                DataConverterPool.register(converters[i], new loadedConverters[i]());
            }
            resolve(DataConverterPool);
        });
    });
}
