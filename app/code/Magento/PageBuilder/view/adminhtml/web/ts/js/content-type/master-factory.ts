/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.types";
import ContentTypeConfigInterface from "../content-type-config.types";
import ContentTypeInterface from "../content-type.types";
import loadModule from "../utils/loader";
import converterResolver from "./converter-resolver";
import Master from "./master";
import MasterCollection from "./master-collection";
import observableUpdaterFactory from "./observable-updater-factory";

/**
 * Create new content instance
 *
 * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
 * @param {ContentTypeConfigInterface} config
 * @returns {Promise<ContentTypeInterface>}
 */
export default function create(
    contentType: ContentTypeInterface | ContentTypeCollectionInterface,
    config: ContentTypeConfigInterface,
): Promise<Master | MasterCollection> {
    return new Promise(
        (resolve: (masterComponent: Master | MasterCollection) => void, reject: (error: string) => void,
    ) => {
        observableUpdaterFactory(config, converterResolver).then((observableUpdater) => {
            loadModule([config.master_component], (masterComponent: typeof Master | typeof MasterCollection) => {
                try {
                    const master = new masterComponent(
                        contentType,
                        observableUpdater,
                    );
                    resolve(master);
                } catch (error) {
                    reject(`Error within master component (${config.master_component}) for ${config.name}.`);
                    console.error(error);
                }
            }, (error: Error) => {
                reject(`Unable to load preview component (${config.master_component}) for ${config.name}. Please ` +
                    `check preview component exists and content type configuration is correct.`);
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
            return null;
        });
    });
}
