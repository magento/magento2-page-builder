import Config from '../config';
import PreviewBlock from '../block/preview/block';
import Block from "../block/block";

let previews: Array<any> = [];

/**
 * Load all preview instances into our cache
 */
export function load(): void {
    const contentBlocks = Config.getInitConfig("contentTypes") as ConfigContentBlocks;
    let blocksToLoad: Array<string> = [],
        blockCodes: Array<any> = []; // @todo should be string, but TS complains
    Object.keys(contentBlocks).forEach((blockKey) => {
        const block = contentBlocks[blockKey];
        if (typeof block.preview_component === 'string') {
            blockCodes.push(blockKey);
            blocksToLoad.push(block.preview_component);
        }
    });

    // @todo this could create a race condition loading these async upfront
    require(blocksToLoad, function () {
        for (let arg: number = 0; arg < arguments.length; ++arg) {
            previews[blockCodes[arg]] = arguments[arg].default;
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
    if (typeof previews[code] === 'undefined') {
        instance = PreviewBlock;
    } else {
        instance = previews[code];
    }

    return new instance(block, blockConfig);
}

// @todo move these into Config class
