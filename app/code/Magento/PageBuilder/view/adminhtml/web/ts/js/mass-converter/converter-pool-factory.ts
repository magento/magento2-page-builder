/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";
import loadModule from "../utils/loader";
import ConverterPool from "./converter-pool";

/**
 * Create a new instance of converter pool
 */
export default function create(contentType: string): Promise<typeof ConverterPool> {
    const config = Config.getContentTypeConfig(contentType);
    const converters: string[] = [];
    let appearanceName: string;
    for (appearanceName of Object.keys(config.appearances)) {
        const appearance = config.appearances[appearanceName];
        if (undefined !== appearance && undefined !== appearance.converters) {
            for (const converterConfig of appearance.converters) {
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
