/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.types";
import ContentTypeConfigInterface from "../content-type-config.types";
import ContentTypeInterface from "../content-type.types";
import loadModule from "../utils/loader";
import observableUpdaterFactory from "./observable-updater-factory";
import Preview from "./preview";
import PreviewCollection from "./preview-collection";
import previewConverterResolver from "./preview-converter-resolver";

/**
 * Create new preview instance
 *
 * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
 * @param {ContentTypeConfigInterface} config
 * @returns {Promise<Preview | PreviewCollection>}
 */
export default function create(
    contentType: ContentTypeInterface | ContentTypeCollectionInterface,
    config: ContentTypeConfigInterface,
): Promise<Preview | PreviewCollection> {
    return new Promise(
        (resolve: (previewComponent: Preview | PreviewCollection) => void, reject: (e: string) => void,
    ) => {
        observableUpdaterFactory(config, previewConverterResolver).then((observableUpdater) => {
            loadModule([config.preview_component], (previewComponent: typeof Preview | typeof PreviewCollection) => {
                try {
                    const preview = new previewComponent(
                        contentType,
                        config,
                        observableUpdater,
                    );
                    resolve(preview);
                } catch (error) {
                    reject(`Error within preview component (${config.preview_component}) for ${config.name}.`);
                    console.error(error);
                }
            }, (error: Error) => {
                reject(`Unable to load preview component (${config.preview_component}) for ${config.name}. Please ` +
                    `check preview component exists and content type configuration is correct.`);
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
            return null;
        });
    });
}
