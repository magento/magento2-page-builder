/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/loader";
import events from "uiEvents";
import _ from "underscore";
import ConfigFieldInterface from "./config-field.d";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import ContentTypeMountEventParamsInterface from "./content-type/content-type-mount-event-params.d";
import masterFactory from "./content-type/master-factory";
import previewFactory from "./content-type/preview-factory";
import FieldDefaultsInterface from "./field-defaults.d";

/**
 * Create new content type
 *
 * @param {ContentTypeConfigInterface} config
 * @param {ContentTypeInterface} parent
 * @param {number} stageId
 * @param {object} data
 * @param {number} childrenLength
 * @returns {Promise<ContentTypeInterface>}
 */
export default function createContentType(
    config: ContentTypeConfigInterface,
    parent: ContentTypeInterface,
    stageId,
    data?: object = {},
    childrenLength: number = 0,
): Promise<ContentTypeInterface> {
    return new Promise((resolve: (contentTypeComponent: any) => void) => {
        loadModule([config.component], (ContentTypeComponent: any) => {
            const contentType = new ContentTypeComponent(
                parent,
                config,
                stageId,
            );
            Promise.all(
                [
                    previewFactory(contentType, config),
                    masterFactory(contentType, config),
                ],
            ).then((resolvedPromises) => {
                const [previewComponent, masterComponent] = resolvedPromises;
                contentType.preview = previewComponent;
                contentType.content = masterComponent;
                contentType.dataStore.update(
                    prepareData(config, data),
                );
                resolve(contentType);
            });
        });
    }).then((contentType: ContentTypeInterface) => {
        events.trigger("contentType:create", {id: contentType.id, contentType});
        events.trigger(config.name + ":contentType:create", {id: contentType.id, contentType});
        fireContentTypeReadyEvent(contentType, childrenLength);
        return contentType;
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * Merge defaults and content type data
 *
 * @param {Config} config
 * @param {object} data
 * @returns {any}
 */
function prepareData(config, data: {}) {
    const defaults: FieldDefaultsInterface = {};
    if (config.fields) {
        _.each(config.fields, (field: ConfigFieldInterface, key: string | number) => {
            defaults[key] = field.default;
        });
    }
    return _.extend(defaults, data);
}

/**
 * A content type is ready once all of its children have mounted
 *
 * @param {ContentType} contentType
 * @param {number} childrenLength
 */
function fireContentTypeReadyEvent(contentType: ContentTypeInterface, childrenLength: number) {
    const fire = () => {
        events.trigger("contentType:mountAfter", {id: contentType.id, contentType});
        events.trigger(contentType.config.name + ":mountAfter", {id: contentType.id, contentType});
    };

    if (childrenLength === 0) {
        fire();
    } else {
        let mountCounter = 0;
        events.on("contentType:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.parent.id === contentType.id) {
                mountCounter++;

                if (mountCounter === childrenLength) {
                    fire();
                    events.off(`contentType:${contentType.id}:mountAfter`);
                }
            }
        }, `contentType:${contentType.id}:mountAfter` );
    }
}
