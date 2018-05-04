/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/loader";
import events from "uiEvents";
import _ from "underscore";
import BlockMountEventParamsInterface from "./content-type/block-mount-event-params.d";
import ConfigFieldInterface from "./config-field.d";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import contentFactory from "./content-type/content-factory";
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
    return new Promise((resolve: (blockComponent: any) => void) => {
        loadModule([config.component], (ContentTypeComponent: any) => {
            const contentType = new ContentTypeComponent(
                parent,
                config,
                stageId,
            );
            Promise.all(
                [
                    previewFactory(contentType, config),
                    contentFactory(contentType, config),
                ],
            ).then((resolvedPromises) => {
                const [previewComponent, contentComponent] = resolvedPromises;
                contentType.preview = previewComponent;
                contentType.content = contentComponent;
                contentType.dataStore.update(
                    prepareData(config, data),
                );
                resolve(contentType);
            });
        });
    }).then((block: ContentTypeInterface) => {
        events.trigger("block:create", {id: block.id, block});
        events.trigger(config.name + ":block:create", {id: block.id, block});
        fireBlockReadyEvent(block, childrenLength);
        return block;
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
 * A block is ready once all of its children have mounted
 *
 * @param {Block} block
 * @param {number} childrenLength
 */
function fireBlockReadyEvent(block: ContentTypeInterface, childrenLength: number) {
    const fire = () => {
        events.trigger("block:ready", {id: block.id, block});
        events.trigger(block.config.name + ":block:ready", {id: block.id, block});
    };

    if (childrenLength === 0) {
        fire();
    } else {
        let mountCounter = 0;
        events.on("block:mount", (args: BlockMountEventParamsInterface) => {
            if (args.block.parent.id === block.id) {
                mountCounter++;

                if (mountCounter === childrenLength) {
                    fire();
                    events.off(`block:mount:${block.id}`);
                }
            }
        }, `block:mount:${block.id}` );
    }
}
