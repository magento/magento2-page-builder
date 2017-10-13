define(['exports', '../config', '../block/preview/block'], function (exports, _config, _block) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.load = load;
    exports.default = get;

    var _config2 = _interopRequireDefault(_config);

    var _block2 = _interopRequireDefault(_block);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var previews = [];
    /**
     * Load all preview instances into our cache
     */
    function load() {
        var contentBlocks = _config2.default.getInitConfig("contentTypes");
        var blocksToLoad = [],
            blockCodes = []; // @todo should be string, but TS complains
        Object.keys(contentBlocks).forEach(function (blockKey) {
            var block = contentBlocks[blockKey];
            if (typeof block.preview_block === 'string') {
                blockCodes.push(blockKey);
                blocksToLoad.push(block.preview_block);
            }
        });
        // @todo this could create a race condition loading these async upfront
        require(blocksToLoad, function () {
            for (var arg = 0; arg < arguments.length; ++arg) {
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
    function get(block, blockConfig) {
        var code = blockConfig.code;
        var instance = void 0;
        if (typeof previews[code] === 'undefined') {
            instance = _block2.default;
        } else {
            instance = previews[code];
        }
        return new instance(block, blockConfig);
    }
});