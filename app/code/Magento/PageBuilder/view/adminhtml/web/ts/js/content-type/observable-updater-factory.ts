/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config.types";
import converterPoolFactory from "../converter/converter-pool-factory";
import massConverterPoolFactory from "../mass-converter/converter-pool-factory";
import ObservableUpdater from "./observable-updater";
import {getStyleRegistryForStage} from "./style-registry";


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
    stageId: string,
): Promise<ObservableUpdater> {
    const promises: Array<Promise<any>> = [
        converterPoolFactory(config.name),
        massConverterPoolFactory(config.name),
    ];
    return Promise.all(promises).then((resolvedPromises) => {
        const [converterPool, massConverterPool] = resolvedPromises;
        return new ObservableUpdater(
            converterPool,
            massConverterPool,
            converterResolver,
            getStyleRegistryForStage(stageId),
        );
    }).catch((error) => {
        console.error(error);
        return null;
    });
}
