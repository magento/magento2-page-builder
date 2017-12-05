define([
    'bluefoot/config',
    'bluefoot/block/preview/abstract'
], function (config, abstract) {
    var loaded = false,
        instances = {};

    var previews = function () {

    };

    /**
     * Load all previews from config
     */
    previews.load = function () {
        if (loaded === false) {

            var contentBlocks = config.getInitConfig("contentBlocks"),
                templates = [],
                keyNames = [];

            for (var key in contentBlocks) {
                if (typeof contentBlocks[key]['preview_block'] === 'string') {
                    templates.push(contentBlocks[key]['preview_block']);
                    keyNames.push(key);
                }
            }

            require(templates, function () {
                for (var arg = 0; arg < arguments.length; ++arg) {
                    instances[keyNames[arg]] = arguments[arg];
                }
            });

            loaded = true;
        }
    };

    /**
     * Retrieve a preview instance
     *
     * @param block
     * @returns {*}
     */
    previews.get = function (block) {
        block = block.code;

        if (typeof instances[block] === 'undefined') {
            return abstract;
        }

        return instances[block];
    };

    return previews;
});