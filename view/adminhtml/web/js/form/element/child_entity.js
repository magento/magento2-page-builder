define([
    'ko',
    'underscore',
    'mageUtils',
    'bluefoot/config',
    'bluefoot/stage/panel/group/block',
    'Magento_Ui/js/form/element/abstract'
], function (ko, _, utils, Config, PanelBlock, Abstract) {
    'use strict';

    return Abstract.extend({
        defaults: {
            value: []
        },

        /**
         * Get the configuration for the particular field
         *
         * @returns {*}
         */
        getFieldConfig: function () {
            return Config.getField(this.code);
        },

        /**
         * Return the configuration for the allow child block(s)?
         *
         * @returns {*}
         */
        getChildBlockTypeConfig: function () {
            var config = this.getFieldConfig();
            return Config.getContentTypeConfig(config.child_block_type);
        },

        /**
         * Ability to remove child entities from the field
         *
         * @param child
         */
        removeChild: function (child) {
            this.value(ko.utils.arrayFilter(this.value(), function (filterChild) {
                return child.id != filterChild.id;
            }));
        },

        /**
         * Add an entity into the child entities field
         */
        addEntity: function () {
            var config = this.getChildBlockTypeConfig();
            if (config) {
                // Create a new block and temporarily push it into childEntities
                // We update the actual values on save
                var panelBlockInstance = new PanelBlock(config, false);
                require([panelBlockInstance.getBlockInstance()], function (BlockInstance) {
                    // Create a new block with no stage associated
                    var block = new BlockInstance(this, false, config);
                    this.value.push(block);
                }.bind(this));
            } else {
                console.warn('Unable to load child block to add new instance');
            }
        }
    });
});
