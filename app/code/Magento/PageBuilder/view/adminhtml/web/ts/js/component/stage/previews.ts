/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/component/loader";
import Block from "../block/block";
import PreviewBlock from "../block/preview/block";
import Config, {ConfigContentBlocks} from "../config";

const previews: any[] = [];

/**
 * Load all preview instances into our cache
 */
export function load(): void {
    const contentBlocks = Config.getConfig("content_types") as ConfigContentBlocks;
    const blocksToLoad: string[] = [];
    const blockCodes: any[] = []; // @todo should be string, but TS complains
    Object.keys(contentBlocks).forEach((blockKey) => {
        const block = contentBlocks[blockKey];
        if (typeof block.preview_component === "string") {
            blockCodes.push(blockKey);
            blocksToLoad.push(block.preview_component);
        }
    });

    // @todo this could create a race condition loading these async upfront
    loadModule(blocksToLoad, (...blocks: any[]) => {
        for (let arg: number = 0; arg < blocks.length; ++arg) {
            previews[blockCodes[arg]] = blocks[arg];
        }
    });
}

/**
 * Get preview instance for a specific block
 *
 * @param {Block} block
 * @param blockConfig
 * @returns {PreviewBlock}
 */
export default function get(block: Block, blockConfig: any): PreviewBlock {
    const code = blockConfig.name;
    let instance: typeof PreviewBlock;
    if (typeof previews[code] === "undefined") {
        instance = PreviewBlock;
    } else {
        instance = previews[code];
    }

    return new instance(block, blockConfig);
}
