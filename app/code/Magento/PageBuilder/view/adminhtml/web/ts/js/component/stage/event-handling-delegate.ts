import ko from "knockout";
import events from "uiEvents";
import {moveArrayItem} from "../../utils/array";
import Block from "../block/block";
import createBlock from "../block/factory";
import {ConfigContentBlock} from "../config";
import Stage from "../stage";

/**
 * Handle event to remove block
 *
 * @param event
 * @param args
 */
function onBlockRemoved(event: Event, args: BlockRemovedParams): void {
    args.parent.removeChild(args.block);

    // Remove the instance from the data store
    args.parent.stage.store.remove(args.block.id);
}

/**
 * Handle when an instance of an existing block is dropped onto a container
 *
 * @param {Event} event
 * @param {BlockInstanceDroppedParams} args
 */
function onBlockInstanceDropped(event: Event, args: BlockInstanceDroppedParams): void {
    const originalParent = args.blockInstance.parent;
    args.blockInstance.parent = args.parent;
    args.parent.addChild(args.blockInstance, args.index);

    events.trigger("block:moved", {
        block: args.blockInstance,
        index: args.index,
        newParent: args.parent,
        originalParent,
    });
}

/**
 * Handle a block being dropped into a container
 *
 * @param {Event} event
 * @param {BlockDroppedParams} args
 */
function onBlockDropped(event: Event, args: BlockDroppedParams) {
    const index = args.index || 0;

    new Promise<Block>((resolve, reject) => {
        if (args.block) {
            return createBlock(args.block.config, args.parent, args.parent.stage).then((block: Block) => {
                args.parent.addChild(block, index);
                events.trigger("block:dropped:create", {id: block.id, block});
                events.trigger(args.block.config.name + ":block:dropped:create", {id: block.id, block});
                return block;
            });
        } else {
            reject("Parameter block missing from event.");
        }
    }).catch((error: string) => {
        console.error( error );
    });
}

/**
 * Handle a block being sorted within it's own container
 *
 * @param {Event} event
 * @param {BlockSortedParams} args
 */
function onBlockSorted(event: Event, args: BlockSortedParams): void {
    const originalIndex = ko.utils.arrayIndexOf(args.parent.children(), args.block);
    if (originalIndex !== args.index) {
        moveArrayItem(args.parent.children, originalIndex, args.index);
    }
}

/**
 * On sorting start & end show all borders on the stage
 *
 * @param {Event} event
 * @param {SortParams} args
 */
function onSortingStart(event: Event, args: SortParams): void {
    args.block.stage.showBorders(true);
}
function onSortingStop(event: Event, args: SortParams): void {
    args.block.stage.showBorders(false);
}

/**
 * Handle container related events for the stage
 *
 * @param {Stage} stage
 */
export function handleEvents(stage: Stage) {
    // Block dropped from left hand panel
    events.on("block:dropped", (event, args: BlockDroppedParams) => {
        if (args.parent.stage.id === stage.id) {
            onBlockDropped(event, args);
        }
    });

    // Block instance being moved between structural elements
    events.on("block:instanceDropped", (event, args: BlockInstanceDroppedParams) => {
        if (args.parent.stage.id === stage.id) {
            onBlockInstanceDropped(event, args);
        }
    });

    // Block being removed from container
    events.on("block:removed", (event, args: BlockRemovedParams) => {
        if (args.parent.stage.id === stage.id) {
            onBlockRemoved(event, args);
        }
    });

    // Block sorted within the same structural element
    events.on("block:sorted", (event, args: BlockSortedParams) => {
        if (args.parent.stage.id === stage.id) {
            onBlockSorted(event, args);
        }
    });

    // Observe sorting actions
    events.on("block:sortStart", (event, args: SortParams) => {
        if (args.block.stage.id === stage.id) {
            onSortingStart(event, args);
        }
    });
    events.on("block:sortStop", (event, args: SortParams) => {
        if (args.block.stage.id === stage.id) {
            onSortingStop(event, args);
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
