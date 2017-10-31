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
        var appearanceApplierComponentName = 'Gene_BlueFoot/js/utils/appearance-applier';
        stage = stage || parent.stage;
        formData = formData || {};
        return new Promise(function (resolve, reject) {
            require([appearanceApplierComponentName], function (appearanceApplier) {
                require(config['appearances'], function () {
                    for (var _len = arguments.length, components = Array(_len), _key = 0; _key < _len; _key++) {
                        components[_key] = arguments[_key];
                    }

                    var appearanceComponents = {};
                    Object.keys(components).map(function (key) {
                        var component = components[key].default;
                        var componentName = component.name.split(/(?=[A-Z])/).join('-').toLowerCase();
                        appearanceComponents[componentName] = new component();
                    });
                    require([getBlockComponentPath(config)], function (BlockInstance) {
                        return resolve(new BlockInstance.default(parent, stage, config, formData, new appearanceApplier.default(appearanceComponents)));
                    }, function (error) {
                        return reject(error);
                    });
                });
            });
        });
    }
});