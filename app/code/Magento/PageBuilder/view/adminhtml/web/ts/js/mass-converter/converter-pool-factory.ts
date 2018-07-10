/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/utils/loader";
import Config from "../config";
import ConverterPool from "./converter-pool";

/**
 * Create a new instance of converter pool
 * @api
 */
export default function create(contentType: string): Promise<typeof ConverterPool> {
    const config = Config.getContentTypeConfig(contentType);
    const converters: string[] = [];
    let appearanceName: string;
    for (appearanceName of Object.keys(config.appearances)) {
        const dataMapping = config.appearances[appearanceName].data_mapping;
        if (undefined !== dataMapping && undefined !== dataMapping.converters) {
            for (const converterConfig of dataMapping.converters) {
                if (!!converterConfig.component && !ConverterPool.get(converterConfig.component)) {
                    converters.push(converterConfig.component);
                }
            }
        }
    }

    return new Promise((resolve: (converterPool: typeof ConverterPool) => void) => {
        loadModule(converters, (...loadedConverters: any[]) => {
            for (let i = 0; i < converters.length; i++) {
                ConverterPool.register(converters[i], new loadedConverters[i]());
            }
            resolve(ConverterPool);
        });
    });
}
