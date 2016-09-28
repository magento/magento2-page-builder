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
     * @param group
     * @constructor
     */
    function Block(block, group) {
        this.config = block;
        this.code = ko.observable(block.code);
        this.name = ko.observable(block.name);
        this.icon = ko.observable(block.icon);

        this.group = group;
    }

    /**
     * Return the block instances to be created when an element is dragged onto the stage
     *
     * @returns {string}
     */
    Block.prototype.getBlockInstance = function () {
        if( typeof this.config.js_block == 'string' ) {
            return this.config.js_block;
        }

        return 'Gene_BlueFoot/js/component/core/block/abstract';
    };

    /**
     * On drag start hide the popped out panel
     *
     * @param draggableThis
     * @param event
     * @param ui
     * @param draggableInstance
     */
    Block.prototype.onDragStart = function (draggableThis, event, ui, draggableInstance) {
        if (this.group) {
            // Hide the groups overlay
            this.group.hidden(true);
        }
    };

    /**
     * On drag stop hide the popped out panel
     *
     * @param draggableThis
     * @param event
     * @param ui
     * @param draggableInstance
     */
    Block.prototype.onDragStop = function (draggableThis, event, ui, draggableInstance) {
        if (this.group) {
            this.group.hidden(false);
        }
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
        if (jQuery(event.target)[0] == sortableThis) {
            if (this.group) {
                // Ensure the group is inactive
                this.group.active(false);
            }

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
        console.log(this.getBlockInstance());
        require([this.getBlockInstance()], function (BlockInstance) {
            console.log(BlockInstance);
            var block = new BlockInstance(parent, parent.stage, this.config, formData);
            parent.addChild(block, index, key);
            parent.refreshChildren();

            if (typeof callbackFn === 'function') {
                callbackFn(block);
            }
        }.bind(this));
    };

    return Block;
});