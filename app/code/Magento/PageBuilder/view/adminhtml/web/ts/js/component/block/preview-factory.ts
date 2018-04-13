/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import ContentTypeConfigInterface from "../../content-type-config.d";
import ContentTypeInterface from "../../content-type.d";
import previewConverterResolver from "../../preview-converter-resolver";
import observableUpdaterFactory from "./observable-updater-factory";

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
): Promise<ContentTypeInterface> {
    return new Promise((resolve: (previewComponent: any) => void) => {
        observableUpdaterFactory(config, previewConverterResolver).then((observableUpdater) => {
            loadModule([config.preview_component], (ContentComponent) => {
                resolve(
                    new ContentComponent(
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
