/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
 * @param {ContentTypeInterface} contentType
 * @param {ContentTypeConfigInterface} config
 * @returns {Promise<ContentTypeInterface>}
 */
export default function create(
    contentType: ContentTypeInterface,
    config: ContentTypeConfigInterface,
): Promise<Preview | PreviewCollection> {
    return new Promise((resolve: (previewComponent: Preview | PreviewCollection) => void) => {
        observableUpdaterFactory(config, previewConverterResolver).then((observableUpdater) => {
            loadModule([config.preview_component], (previewComponent: typeof Preview | typeof PreviewCollection) => {
                resolve(
                    new previewComponent(
                        contentType,
                        config,
                        observableUpdater,
                    ),
                );
            });
        }).catch((error) => {
            console.error(error);
        });
    });
}
