define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = createBlock;
    /**
     * Retrieve the block instance from the config object
     *
     * @param config
     * @returns {any|string}
     */
    function getBlockComponentPath(config) {
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
    function createBlock(config, parent, stage, formData) {
        stage = stage || parent.stage;
        formData = formData || {};
        return new Promise(function (resolve, reject) {
            require([getBlockComponentPath(config)], function (BlockInstance) {
                return resolve(new BlockInstance.default(parent, stage, config, formData));
            }, function (error) {
                return reject(error);
            });
        });
    }
});