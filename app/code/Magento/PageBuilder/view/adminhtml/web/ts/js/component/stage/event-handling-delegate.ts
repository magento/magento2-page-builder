import ko from "knockout";
import {moveArrayItem} from "../../utils/array";
import Block from "../block/block";
import createBlock from "../block/factory";
import {ConfigContentBlock} from "../config";
import EventBus from "../event-bus";
import Stage from "../stage";

/**
 * Handle event to remove block
 *
 * @param event
 * @param params
 */
function onBlockRemoved(event: Event, params: BlockRemovedParams): void {
    params.parent.removeChild(params.block);

    // Remove the instance from the data store
    params.parent.store.remove(params.block.id);
}

/**
 * Handle when an instance of an existing block is dropped onto a container
 *
 * @param {Event} event
 * @param {BlockInstanceDroppedParams} params
 */
function onBlockInstanceDropped(event: Event, params: BlockInstanceDroppedParams): void {
    const originalParent = params.blockInstance.parent;
    params.blockInstance.parent = params.parent;
    params.parent.addChild(params.blockInstance, params.index);

    EventBus.trigger("block:moved", {
        block: params.blockInstance,
        index: params.index,
        newParent: params.parent,
        originalParent,
    });
}

/**
 * Handle a block being dropped into a container
 *
 * @param {Event} event
 * @param {BlockDroppedParams} params
 */
function onBlockDropped(event: Event, params: BlockDroppedParams) {
    const index = params.index || 0;

    new Promise<Block>((resolve, reject) => {
        if (params.block) {
            return createBlock(params.block.config, params.parent, params.stageId).then((block: Block) => {
                params.parent.addChild(block, index);
                EventBus.trigger("block:dropped:create", {id: block.id, block});
                EventBus.trigger(params.block.config.name + ":block:dropped:create", {id: block.id, block});
                return block;
            });
        } else {
            reject("Parameter block missing from event.");
        }
    }).catch((error: string) => {
        console.error(error);
    });
}

/**
 * Handle a block being sorted within it's own container
 *
 * @param {Event} event
 * @param {BlockSortedParams} params
 */
function onBlockSorted(event: Event, params: BlockSortedParams): void {
    const originalIndex = ko.utils.arrayIndexOf(params.parent.children(), params.block);
    if (originalIndex !== params.index) {
        moveArrayItem(params.parent.children, originalIndex, params.index);
    }
}

/**
 * On sorting start & end show all borders on the stage
 *
 * @param {Event} event
 * @param {SortParams} params
 */
function onSortingStart(event: Event, params: SortParams): void {
    params.block.stage.showBorders(true);
}
function onSortingStop(event: Event, params: SortParams): void {
    params.block.stage.showBorders(false);
}

/**
 * Handle container related events for the stage
 *
 * @param {Stage} stage
 */
export function handleEvents(stage: Stage) {
    // Block dropped from left hand panel
    EventBus.on("block:dropped", (event, params: BlockDroppedParams) => {
        if (params.stageId === stage.id) {
            onBlockDropped(event, params);
        }
    });

    // Block instance being moved between structural elements
    EventBus.on("block:instanceDropped", (event, params: BlockInstanceDroppedParams) => {
        if (params.stageId === stage.id) {
            onBlockInstanceDropped(event, params);
        }
    });

    // Block being removed from container
    EventBus.on("block:removed", (event, params: BlockRemovedParams) => {
        if (params.stageId === stage.id) {
            onBlockRemoved(event, params);
        }
    });

    // Block sorted within the same structural element
    EventBus.on("block:sorted", (event, params: BlockSortedParams) => {
        if (params.stageId === stage.id) {
            onBlockSorted(event, params);
        }
    });

    // Observe sorting actions
    EventBus.on("block:sortStart", (event, params: SortParams) => {
        if (params.stageId === stage.id) {
            onSortingStart(event, params);
        }
    });
    EventBus.on("block:sortStop", (event, params: SortParams) => {
        if (params.stageId === stage.id) {
            onSortingStop(event, params);
        }
    });
}

export interface BlockDroppedParams {
    parent: Block;
    index: number;
    block: {
        config: ConfigContentBlock,
    };
}

export interface BlockInstanceDroppedParams {
    parent: Block;
    blockInstance: Block;
    index?: number;
}

export interface BlockRemovedParams {
    parent: Block;
    index: number;
    block: Block;
}

export interface BlockSortedParams {
    parent: Block;
    block: Block;
    index: number;
}

export interface SortParams {
    block: Block;
    event: Event;
    originalEle: JQuery;
    placeholder: JQuery;
    helper?: any;
}

export interface BlockMovedEventParams {
    block: Block;
    index: number;
    newParent: Block;
    originalParent: Block;
}
