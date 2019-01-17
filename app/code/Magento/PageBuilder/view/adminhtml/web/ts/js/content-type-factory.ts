/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import loadModule from "Magento_PageBuilder/js/utils/loader";
import _ from "underscore";
import ConfigFieldInterface from "./config-field";
import ContentType from "./content-type";
import ContentTypeCollection from "./content-type-collection";
import ContentTypeCollectionInterface from "./content-type-collection.d";
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
 * @api
 */
export default function createContentType(
    config: ContentTypeConfigInterface,
    parent: ContentTypeCollectionInterface,
    stageId: string,
    data: object = {},
    childrenLength: number = 0,
): Promise<ContentTypeInterface | ContentTypeCollectionInterface> {
    return new Promise(
        (resolve: (contentType: ContentType | ContentTypeCollection) => void,
         reject: (error: string) => void,
    ) => {
        loadModule([config.component], (contentTypeComponent: typeof ContentType | typeof ContentTypeCollection) => {
            try {
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
                }).catch((error) => {
                    reject(error);
                });
            } catch (error) {
                reject(`Error within component (${config.component}) for ${config.name}.`);
                console.error(error);
            }
        }, (error: string) => {
            reject(`Unable to load component (${config.component}) for ${config.name}. Please check component exists`
                + ` and content type configuration is correct.`);
            console.error(error);
        });
    }).then((contentType) => {
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
    const defaults: FieldDefaultsInterface = prepareDefaults(config.fields || {});

    // Set all content types to be displayed by default
    defaults.display = true;

    return _.extend(
        defaults,
        data,
        {
            name: config.name,
        },
    );
}

/**
 * Prepare the default values for fields within the form
 *
 * @param {ConfigFieldInterface} fields
 * @returns {FieldDefaultsInterface}
 */
function prepareDefaults(fields: ConfigFieldInterface): FieldDefaultsInterface {
    return _.mapObject(fields, (field) => {
        if (!_.isUndefined(field.default)) {
            return field.default;
        } else if (_.isObject(field)) {
            return prepareDefaults(field);
        }
    });
}

/**
 * A content type is ready once all of its children have mounted
 *
 * @param {ContentType | ContentTypeCollection} contentType
 * @param {number} childrenLength
 */
function fireContentTypeReadyEvent(contentType: ContentType | ContentTypeCollection, childrenLength: number) {
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
