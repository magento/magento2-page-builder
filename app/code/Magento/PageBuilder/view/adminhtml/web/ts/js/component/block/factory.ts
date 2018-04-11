/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import {ConfigContentBlock} from "../config";
import EventBus from "../event-bus";
import EditableArea, {BlockMountEventParams} from "../stage/structural/editable-area";
import Block from "./block";
import PreviewBlock from "./preview/block";
import dataConverterPoolFactory from "./data-converter-pool-factory";
import elementConverterPoolFactory from "./element-converter-pool-factory";
import PreviewBuilder from "../../preview-builder";
import ContentBuilder from "../../content-builder";
import Content from "../../content";

/**
 * Retrieve the block instance from the config object
 *
 * @param config
 * @returns {any|string}
 */
function getBlockComponentPath(config: ConfigContentBlock): string {
    return config.component || "Magento_PageBuilder/js/content-type";
}

/**
 * Retrieve the block instance from the config object
 *
 * @param config
 * @returns {any|string}
 */
function getPreviewBlockComponentPath(config: ConfigContentBlock): string {
    return config.preview_component || "Magento_PageBuilder/js/component/block/preview/block";
}

/**
 * A block is ready once all of its children have mounted
 *
 * @param {Block} block
 * @param {number} childrenLength
 */
function fireBlockReadyEvent(block: Block, childrenLength: number) {
    const fire = () => {
        EventBus.trigger("block:ready", {id: block.id, block});
        EventBus.trigger(block.config.name + ":block:ready", {id: block.id, block});
    };

    if (childrenLength === 0) {
        fire();
    } else {
        let mountCounter = 0;
        const eventCallback = (event: Event, params: BlockMountEventParams) => {
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

/**
 * Create a new instance of a block
 *
 * @param {ConfigContentBlock} config
 * @param {EditableArea} parent
 * @param stageId
 * @param {object} formData
 * @param {number} childrenLength
 * @returns {Promise<Block>}
 */
export default function createBlock(
    config: ConfigContentBlock,
    parent: EditableArea,
    stageId,
    formData?: object,
    childrenLength: number = 0,
): Promise<Block> {
    formData = formData || {};
    const componentsPromise: Array<Promise<any>> = [
        elementConverterPoolFactory(config.name),
        dataConverterPoolFactory(config.name),
    ];
    const contentBuilder = new ContentBuilder();
    const previewBuilder = new PreviewBuilder();
    return new Promise((resolve: (blockComponent: any) => void) => {
        Promise.all(componentsPromise).then((loadedConverters) => {
            const [elementConverterPool, dataConverterPool] = loadedConverters;
            loadModule([getBlockComponentPath(config), getPreviewBlockComponentPath(config)], (...blockComponents: any) => {
                const [blockComponent, previewComponent] = blockComponents;
                previewBuilder.setElementDataConverter(elementConverterPool)
                    .setDataConverter(dataConverterPool)
                    .setConfig(config)
                    .setClassInstance(previewComponent);
                contentBuilder.setElementDataConverter(elementConverterPool)
                    .setDataConverter(dataConverterPool)
                    .setClassInstance(Content);

                const defaults: FieldDefaults = {};
                if (config.fields) {
                    _.each(config.fields, (field: ConfigFieldConfig, key: string | number) => {
                        defaults[key] = field.default;
                    });
                }

                resolve(
                    new blockComponent(
                        parent,
                        config,
                        stageId,
                        _.extend(defaults, formData),
                        previewBuilder,
                        contentBuilder
                    )
                );
            });
        }).catch((error) => {
            console.error(error);
        });
    }).then((block: Block) => {
            EventBus.trigger("block:create", {id: block.id, block});
            EventBus.trigger(config.name + ":block:create", {id: block.id, block});
            fireBlockReadyEvent(block, childrenLength);
            return block;
        });
}

export interface BlockCreateEventParams {
    id: string;
    block: Block;
}

export interface BlockReadyEventParams {
    id: string;
    block: Block;
}
