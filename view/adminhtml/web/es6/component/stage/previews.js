import Config from '../config';
import PreviewBlock from '../block/preview/block';
let previews = [];
/**
 * Load all preview instances into our cache
 */
export function load() {
    const contentBlocks = Config.getInitConfig("contentBlocks");
    let blocksToLoad = [], blockCodes = []; // @todo should be string, but TS complains
    Object.keys(contentBlocks).forEach((blockKey) => {
        const block = contentBlocks[blockKey];
        if (typeof block.preview_block === 'string') {
            blockCodes.push(blockKey);
            blocksToLoad.push(block.preview_block);
        }
    });
    // @todo this could create a race condition loading these async upfront
    require(blocksToLoad, function () {
        for (let arg = 0; arg < arguments.length; ++arg) {
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
export default function get(block, blockConfig) {
    const code = blockConfig.code;
    let instance;
    if (typeof previews[code] === 'undefined') {
        instance = PreviewBlock;
    }
    else {
        instance = previews[code];
    }
    return new instance(block, blockConfig);
}
