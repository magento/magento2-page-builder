import { StageInterface } from '../stage.d';
import { EditableAreaInterface } from '../stage/structural/editable-area.d';
import { Block } from './block';

interface ConfigObject {
    js_block?: string;
    [key: string]: any
}

/**
 * Retrieve the block instance from the config object
 *
 * @param config
 * @returns {any|string}
 */
function getBlockComponentPath(config: ConfigObject): string {
    return config.js_block || 'bluefoot/block/abstract';
}

/**
 * Create a new instance of a block
 *
 * @param config
 * @param parent
 * @param stage
 * @param formData
 * @returns {Promise<BlockInterface>}
 */
export default async function createBlock(config: ConfigObject, parent: EditableAreaInterface, stage: StageInterface, formData?: object): Promise<Block> {
    let c: typeof Block = await import(getBlockComponentPath(config));
    return new c(parent, stage || parent.stage, config, formData || {});
}
