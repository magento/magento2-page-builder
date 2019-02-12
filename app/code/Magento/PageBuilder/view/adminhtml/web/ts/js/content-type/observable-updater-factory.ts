/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config.types";
import converterPoolFactory from "../converter/converter-pool-factory";
import massConverterPoolFactory from "../mass-converter/converter-pool-factory";
import ObservableUpdater from "./observable-updater";

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
        converterPoolFactory(config.name),
        massConverterPoolFactory(config.name),
    ];
    return new Promise((resolve: (component: any) => void) => {
        Promise.all(promises).then((resolvedPromises) => {
            const [converterPool, massConverterPool] = resolvedPromises;
            resolve(
                new ObservableUpdater(
                    converterPool,
                    massConverterPool,
                    converterResolver,
                ),
            );
        }).catch((error) => {
            console.error(error);
            return null;
        });
    });
}
