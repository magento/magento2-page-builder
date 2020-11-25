/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import Config from "./config";
import ContentType from "./content-type";
import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface, {
    ConfigFieldInterface,
    ContentTypeConfigBreakpointInterface,
} from "./content-type-config.types";
import ContentTypeInterface from "./content-type.types";
import {ContentTypeMountEventParamsInterface} from "./content-type/content-type-events.types";
import Master from "./content-type/master";
import MasterCollection from "./content-type/master-collection";
import masterFactory from "./content-type/master-factory";
import Preview from "./content-type/preview";
import PreviewCollection from "./content-type/preview-collection";
import previewFactory from "./content-type/preview-factory";
import loadModule from "./utils/loader";

type ViewFactory = (
    contentType: ContentTypeInterface | ContentTypeCollectionInterface,
    config: ContentTypeConfigInterface,
) => Promise<Preview | PreviewCollection | Master | MasterCollection>;

/**
 * Create new content type
 *
 * @param {ContentTypeConfigInterface} config
 * @param {ContentTypeInterface} parentContentType
 * @param {string} stageId
 * @param {object} data
 * @param {number} childrenLength
 * * @param {object} viewportsData
 * @returns {Promise<ContentTypeInterface>}
 * @api
 */
export default function createContentType(
    config: ContentTypeConfigInterface,
    parentContentType: ContentTypeCollectionInterface,
    stageId: string,
    data: object = {},
    childrenLength: number = 0,
    viewportsData: object = {},
): Promise<ContentTypeInterface | ContentTypeCollectionInterface> {
    return new Promise(
        (resolve: (contentType: ContentTypeInterface | ContentTypeCollectionInterface) => void,
         reject: (error: string) => void,
    ) => {
        loadModule([config.component], (contentTypeComponent: typeof ContentType) => {
            try {
                const contentType = new contentTypeComponent(
                    parentContentType,
                    config,
                    stageId,
                );
                const viewFactory: ViewFactory = Config.getMode() === "Preview" ? previewFactory : masterFactory;
                viewFactory(contentType, config).then((viewComponent) => {
                    const viewName = Config.getMode() === "Preview" ? "preview" : "content";
                    contentType[viewName] = viewComponent;
                    assignDataToDataStores(contentType, config, data, viewportsData);
                    resolve(contentType);
                }).catch((error) => {
                    reject(error);
                });
            } catch (error) {
                reject(`Error within component (${config.component}) for ${config.name}.`);
                console.error(error);
            }
        }, (error: Error) => {
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

function assignDataToDataStores(
    contentType: ContentTypeInterface,
    config: ContentTypeConfigInterface,
    data: {[key: string]: any},
    viewportsData: {[key: string]: any},
) {
    const defaultData = prepareData(config, data);
    const currentViewport = Config.getConfig("viewport") || Config.getConfig("defaultViewport");

    _.each(Config.getConfig("viewports"), (viewport: ContentTypeConfigBreakpointInterface, name: string) => {
        let viewportData = {};
        const breakpoint = config.breakpoints[name];
        const viewportConfig = breakpoint && breakpoint.fields ? _.extend({}, breakpoint, {name: config.name}) : {};

        if (!_.isEmpty(viewportConfig)) {
            viewportsData[name] = viewportsData[name] || {};
            viewportData = prepareData(viewportConfig, viewportsData[name]);
        }
        contentType.dataStores[name].setState(_.extend({}, defaultData, viewportData));
    });
    contentType.setViewportDataToDataStore(currentViewport);
}

/**
 * Merge defaults and content type data
 *
 * @param {ContentTypeConfigInterface} config
 * @param {object} data
 * @returns {any}
 */
function prepareData(config: ContentTypeConfigInterface, data: {[key: string]: any}) {
    const appearance = data.appearance + "-appearance";
    const fields = config.fields[appearance] || config.fields.default;
    const defaults: FieldDefaultsInterface = prepareDefaults(fields || {});

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
    if (_.isEmpty(fields)) {
        return {};
    }

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
 * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
 * @param {number} childrenLength
 */
function fireContentTypeReadyEvent(
    contentType: ContentTypeInterface | ContentTypeCollectionInterface,
    childrenLength: number = 0,
) {
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
            if (args.contentType.parentContentType.id === contentType.id) {
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
