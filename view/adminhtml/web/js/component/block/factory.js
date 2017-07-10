/**
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([], function () {

    /**
     * Factory for creating new instances of blocks
     *
     * @constructor
     */
    function BlockFactory() {

    }

    /**
     * Create a new block instance from config & parent
     *
     * @param config
     * @param parent
     * @param stage
     * @param formData
     * @returns {*}
     */
    BlockFactory.prototype.create = function (config, parent, stage, formData) {
        var self = this;
        stage = stage || parent.stage;
        formData = formData || {};
        return new Promise(function (resolve, reject) {
            require([self._getBlockInstance(config)], function (BlockInstance) {
                return resolve(new BlockInstance(parent, stage, config, formData));
            }.bind(this), function (error) {
                return reject(error);
            });
        });
    };

    /**
     * Retrieve the block instance
     *
     * @param config
     * @returns {*}
     * @private
     */
    BlockFactory.prototype._getBlockInstance = function (config) {
        return config.js_block || 'Gene_BlueFoot/js/component/block/abstract';
    };

    return BlockFactory;
});