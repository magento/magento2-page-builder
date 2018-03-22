/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import Config from "../config";
import DataConverterPool from "./data-converter-pool";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<> {
    const config = Config.getContentType(contentType);
    const converters = [];
    for (const appearance of config.appearances) {
        const dataMapping = appearance.data_mapping;
        if (dataMapping !== undefined && dataMapping.converters !== undefined) {
            for (const converter of dataMapping.converters) {
                 if (!!converter.component && !DataConverterPool.get(converter.component)) {
                    converters.push(converter.component);
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
