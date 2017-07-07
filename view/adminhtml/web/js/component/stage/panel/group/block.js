/**
 * - Block.js
 * A block that resides inside a group within the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko'
], function (ko) {

    /**
     * Content / page builder block residing inside groups within the panel
     *
     * @param block
     * @constructor
     */
    function Block(block) {
        this.config = block;
        this.code = ko.observable(block.code);
        this.name = ko.observable(block.name);
        this.icon = ko.observable(block.icon);
    }

    /**
     * Return the block instances to be created when an element is dragged onto the stage
     *
     * @returns {string}
     */
    Block.prototype.getBlockInstance = function () {
        if (typeof this.config.js_block === 'string') {
            return this.config.js_block;
        }

        return 'Gene_BlueFoot/js/component/block/abstract';
    };

    /**
     * When the block is "dropped" into a column or row it will fire an onSortRecieve due to way we've combined
     * draggable and sortable.
     *
     * @param sortableThis
     * @param event
     * @param ui
     * @param sortableInstance
     */
    Block.prototype.onSortReceive = function (sortableThis, event, ui, sortableInstance) {
        // This event can fire multiple times, only capture the output once
        if (jQuery(event.target)[0] === sortableThis) {
            // Remove the dragged item
            if (sortableInstance.draggedItem) {
                var index = sortableInstance.draggedItem.index();

                // 0s timeout to wait for DOM to update
                setTimeout(function () {
                    sortableInstance.draggedItem.remove();
                }, 0);

                // Determine the parent, and add the new block instance as a child
                var parent = ko.dataFor(jQuery(event.target)[0]);
                this.insert(parent, index, false, function (block) {
                    // Refresh sortable to ensure any new elements are recognised
                    jQuery(sortableThis).sortable('refresh');

                    if (block.editOnInsert) {
                        // Open the edit panel
                        block.edit();
                    }
                });
            }
        }
    };

    /**
     * Insert block into parent
     *
     * @param parent
     * @param index
     * @param formData
     * @param callbackFn
     * @param key
     */
    Block.prototype.insert = function (parent, index, formData, callbackFn, key) {
        key = key || false;
        require([this.getBlockInstance()], function (BlockInstance) {
            var block = new BlockInstance(parent, parent.stage, this.config, formData);
            parent.addChild(block, index, key);

            if (typeof callbackFn === 'function') {
                callbackFn(block);
            }
        }.bind(this));
    };

    return Block;
});