/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import {ConfigContentBlock} from "../config";
import EventBus from "../event-bus";
import Stage from "../stage";
import EditableArea, {BlockMountEventParams} from "../stage/structural/editable-area";
import Block from "./block";

/**
 * Retrieve the block instance from the config object
 *
 * @param config
 * @returns {any|string}
 */
function getBlockComponentPath(config: ConfigContentBlock): string {
    return config.component || "Magento_PageBuilder/js/component/block/block";
}

/**
 * A block is ready once all of it's children have mounted
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
 * @param {Stage} stage
 * @param {object} formData
 * @param {number} childrenLength
 * @returns {Promise<Block>}
 */
export default function createBlock(
    config: ConfigContentBlock,
    parent: EditableArea,
    stage: Stage,
    formData?: object,
    childrenLength: number = 0,
): Promise<Block> {
    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise((resolve: (blockComponent: any) => void) => {
        loadModule([getBlockComponentPath(config)], (blockComponent: typeof Block) => {
            resolve(new blockComponent(parent, stage, config, formData));
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
