import Block from './block';
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import loadModule from 'Gene_BlueFoot/js/component/loader';


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
    return config.js_block || 'Gene_BlueFoot/js/component/block/block';
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
// export default async function createBlock(config: ConfigObject, parent: EditableAreaInterface, stage: StageInterface, formData?: object): Promise<Block> {
//     let c: typeof Block = await import(getBlockComponentPath(config));
//     return new c(parent, stage || parent.stage, config, formData || {});
// }
export default function createBlock(config: ConfigObject, parent: EditableArea, stage: Stage, formData?: object): Promise<Block> {
    stage = stage || parent.stage;
    formData = formData || {};
    return new Promise(function (resolve, reject) {
        const componentPath = getBlockComponentPath(config);
        loadModule([componentPath], (factory: any) => {
            return resolve(new factory(parent, stage, config, formData));
        }, (error: string) => {
            return reject(error);
        });
    });
}
