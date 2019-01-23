/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import loadModule from "utils/loader";
import ContentType from "./content-type";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface from "./content-type-config.types";
import ContentTypeInterface from "./content-type.types";
import {ContentTypeMountEventParamsInterface} from "./content-type/content-type-events.types";
import masterFactory from "./content-type/master-factory";
import previewFactory from "./content-type/preview-factory";

/**
 * Create new content type
 *
 * @param {ContentTypeConfigInterface} config
 * @param {ContentTypeInterface} parent
 * @param {number} stageId
 * @param {object} data
 * @param {number} childrenLength
 * @returns {Promise<ContentTypeInterface>}
 * @api
 */
export default function createContentType(
    config: ContentTypeConfigInterface,
    parent: ContentTypeCollectionInterface,
    stageId: string,
    data: object = {},
    childrenLength: number = 0,
): Promise<ContentTypeInterface | ContentTypeCollectionInterface> {
    return new Promise((resolve: (contentType: ContentTypeInterface | ContentTypeCollectionInterface) => void) => {
        loadModule([config.component], (contentTypeComponent: typeof ContentType) => {
            const contentType = new contentTypeComponent(
                parent,
                config,
                stageId,
            );
            Promise.all(
                [
                    previewFactory(contentType, config),
                    masterFactory(contentType, config),
                ],
            ).then(([previewComponent, masterComponent]) => {
                contentType.preview = previewComponent;
                contentType.content = masterComponent;
                contentType.dataStore.update(
                    prepareData(config, data),
                );
                resolve(contentType);
            });
        });
    }).then((contentType: ContentTypeInterface | ContentTypeCollectionInterface) => {
        events.trigger("contentType:createAfter", {id: contentType.id, contentType});
        events.trigger(config.name + ":createAfter", {id: contentType.id, contentType});
        fireContentTypeReadyEvent(contentType, childrenLength);
        return contentType;
    }).catch((error) => {
        console.error(error);
        return null;
    });
}

/**
 * Merge defaults and content type data
 *
 * @param {ContentTypeConfigInterface} config
 * @param {object} data
 * @returns {any}
 */
function prepareData(config: ContentTypeConfigInterface, data: {}) {
    const defaults: FieldDefaultsInterface = {
        display: true,
    };
    if (config.fields) {
        _.each(config.fields, (field, key: string | number) => {
            defaults[key] = field.default;
        });
    }
    return _.extend(
        defaults,
        data,
        {
            name: config.name,
        },
    );
}

/**
 * A content type is ready once all of its children have mounted
 *
 * @param {ContentType} contentType
 * @param {number} childrenLength
 */
function fireContentTypeReadyEvent(contentType: ContentTypeInterface, childrenLength: number) {
    const fire = () => {
        const params = {id: contentType.id, contentType, expectChildren: childrenLength};
        events.trigger("contentType:mountAfter", params);
        events.trigger(contentType.config.name + ":mountAfter", params);
    };

    if (childrenLength === 0) {
        fire();
    } else {
        let mountCounter = 0;
        events.on("contentType:mountAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.contentType.parent.id === contentType.id) {
                mountCounter++;

                if (mountCounter === childrenLength) {
                    mountCounter = 0;
                    fire();
                    events.off(`contentType:${contentType.id}:mountAfter`);
                }
            }
        }, `contentType:${contentType.id}:mountAfter` );
    }
}

/**
 * @api
 */
export interface FieldDefaultsInterface {
    [key: string]: any;
}
