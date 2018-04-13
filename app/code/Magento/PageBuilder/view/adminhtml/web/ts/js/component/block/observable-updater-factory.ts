/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../../content-type-config.d";
import ObservableUpdater from "../../observable-updater";
import dataConverterPoolFactory from "./data-converter-pool-factory";
import elementConverterPoolFactory from "./element-converter-pool-factory";

/**
 * Create new observable updater instance
 *
 * @param {ContentTypeConfigInterface} config
 * @param {Function} converterResolver
 * @returns {Promise<ObservableUpdater>}
 */
export default function create(
    config: ContentTypeConfigInterface,
    converterResolver: (config: object) => string,
): Promise<ObservableUpdater> {
    const promises: Array<Promise<any>> = [
        elementConverterPoolFactory(config.name),
        dataConverterPoolFactory(config.name),
    ];
    return new Promise((resolve: (component: any) => void) => {
        Promise.all(promises).then((resolvedPromises) => {
            const [elementConverterPool, dataConverterPool] = resolvedPromises;
            resolve(
                new ObservableUpdater(
                    elementConverterPool,
                    dataConverterPool,
                    converterResolver,
                ),
            );
        }).catch((error) => {
            console.error(error);
        });
    });
}
