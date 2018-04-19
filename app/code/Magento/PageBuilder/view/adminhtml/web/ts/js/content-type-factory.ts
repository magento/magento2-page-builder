/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from "underscore";
import loadModule from "Magento_PageBuilder/js/component/loader";
import contentFactory from "./content-factory";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import previewFactory from "./preview-factory";
import EventBus from "./component/event-bus";
import BlockMountEventParamsInterface from "./component/block/block-mount-event-params.d";
import ConfigFieldInterface from "./component/block/config-field.d";
import FieldDefaultsInterface from "./component/block/field-defaults.d";

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
                contentType.store.update(
                    contentType.id,
                    prepareData(config, data),
                );
                resolve(contentType);
            });
        });
    }).then((block: ContentTypeInterface) => {
        EventBus.trigger("block:create", {id: block.id, block});
        EventBus.trigger(config.name + ":block:create", {id: block.id, block});
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
        EventBus.trigger("block:ready", {id: block.id, block});
        EventBus.trigger(block.config.name + ":block:ready", {id: block.id, block});
    };

    if (childrenLength === 0) {
        fire();
    } else {
        let mountCounter = 0;
        const eventCallback = (event: Event, params: BlockMountEventParamsInterface) => {
            if (params.block.parent.id === block.id) {
                mountCounter++;

                if (mountCounter === childrenLength) {
                    fire();
                    EventBus.off("block:mount", eventCallback);
                }
            }
        };
        EventBus.on("block:mount", eventCallback);
    }
}
