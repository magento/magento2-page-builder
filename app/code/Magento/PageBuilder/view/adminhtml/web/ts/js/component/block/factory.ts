/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import EventBus from "../event-bus";
import dataConverterPoolFactory from "./data-converter-pool-factory";
import elementConverterPoolFactory from "./element-converter-pool-factory";
import PreviewBuilder from "../../preview-builder";
import ContentBuilder from "../../content-builder";
import ContentTypeInterface from  "../../content-type.d";
import FieldDefaultsInterface from "./field-defaults.d";
import ConfigFieldInterface from "./config-field.d";
import ContentTypeConfigInterface from "../../content-type-config.d";
import BlockMountEventParamsInterface from "./block-mount-event-params.d";

/**
 * Create new content type instance
 *
 * @param {ContentTypeConfigInterface} config
 * @param {ContentTypeInterface} parent
 * @param {number} stageId
 * @param {object} data
 * @param {number} childrenLength
 * @returns {Promise<ContentTypeInterface>}
 */
export default function createBlock(
    config: ContentTypeConfigInterface,
    parent: ContentTypeInterface,
    stageId,
    data?: object = {},
    childrenLength: number = 0,
): Promise<ContentTypeInterface> {
    const promises: Array<Promise<any>> = [
        elementConverterPoolFactory(config.name),
        dataConverterPoolFactory(config.name),
    ];
    const contentBuilder = new ContentBuilder();
    const previewBuilder = new PreviewBuilder();
    return new Promise((resolve: (blockComponent: any) => void) => {
        Promise.all(promises).then((resolvedPromises) => {
            const [elementConverterPool, dataConverterPool,] = resolvedPromises;
            const componentPaths: Array<string> = [config.component, config.preview_component, config.content_component];
            loadModule(componentPaths, (...loadedComponents: any) => {
                const [ContentTypeComponent, PreviewComponent, ContentComponent] = loadedComponents;
                previewBuilder.setElementDataConverter(elementConverterPool)
                    .setDataConverter(dataConverterPool)
                    .setConfig(config)
                    .setClassInstance(PreviewComponent);

                contentBuilder.setElementDataConverter(elementConverterPool)
                    .setDataConverter(dataConverterPool)
                    .setClassInstance(ContentComponent);

                resolve(
                    new ContentTypeComponent(
                        parent,
                        config,
                        stageId,
                        prepareData(config, data),
                        previewBuilder,
                        contentBuilder
                    )
                );
            });
        }).catch((error) => {
            console.error(error);
        });
    }).then((block: ContentTypeInterface) => {
        EventBus.trigger("block:create", {id: block.id, block});
        EventBus.trigger(config.name + ":block:create", {id: block.id, block});
        fireBlockReadyEvent(block, childrenLength);
        return block;
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
