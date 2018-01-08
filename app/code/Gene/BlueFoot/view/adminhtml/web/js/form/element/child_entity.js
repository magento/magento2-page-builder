/*eslint-disable vars-on-top, strict */
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * Child Entity UI Component
 */
define([
    'ko',
    'underscore',
    'mageUtils',
    'bluefoot/config',
    'bluefoot/utils/array',
    'bluefoot/stage/panel/group/block',
    'Magento_Ui/js/form/element/abstract',
    'uiRegistry'
], function (ko, _, utils, Config, arrayUtil, PanelBlock, Abstract, registry) {
    'use strict';

    return Abstract.extend({
        defaults: {
            value: []
        },

        /**
         * Convert the JSON string into it's respected values
         *
         * @returns {exports}
         */
        setInitialValue: function () {
            this._super();

            // Update the children to reflect the correct parent
            ko.utils.arrayForEach(this.value(), function (child) {
                child.parent = this;
            }.bind(this));

            return this;
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
                return child.id !== filterChild.id;
            }));
        },

        /**
         * Retrieve the parent form
         *
         * @returns {*}
         */
        getParentForm: function () {
            var container = registry.get(this.parentName),
                fieldset = registry.get(container.parentName);

            return registry.get(fieldset.parentName);
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
                    return block.edit();
                }.bind(this));
            } else {
                console.warn('Unable to load child block to add new instance');
            }
        },

        /**
         * Event called when sorting starts on this element
         *
         * @param sortableThis
         * @param event
         * @param ui
         * @param sortableInstance
         */
        onSortStart: function (sortableThis, event, ui) {
            ui.item.show();
            ui.item.addClass('bluefoot-sorting-original');
            ui.helper.css({width: '', height: ''});

            this.originalIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);
        },

        /**
         * On sort update move the element
         *
         * @param sortableThis
         * @param event
         * @param ui
         * @param sortableInstance
         * @returns {boolean}
         */
        onSortUpdate: function (sortableThis, event, ui) {
            var item = ui.item,
                parentEl = ui.item.parent()[0],
                newIndex = ko.utils.arrayIndexOf(ui.item.parent().children(), ui.item[0]);

            ui.item.removeClass('bluefoot-sorting-original');

            // Only run the event once
            if (item && sortableThis === parentEl) {

                // The element hasn't moved
                if (this.originalIndex === newIndex) {
                    return false;
                }
                // Move the array item to that new index
                arrayUtil.moveArrayItem(this.value, this.originalIndex, newIndex);

                // Remove the item from the UI
                item.remove();

                this.refreshValue();
            }
        },

        /**
         * Refresh the value
         */
        refreshValue: function () {
            var data = this.value().slice(0);

            this.value([]);
            this.value(data);
        }
    });
});
