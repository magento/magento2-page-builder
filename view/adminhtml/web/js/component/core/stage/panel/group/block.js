/**
 * - Block.js
 * A block that resides inside a group within the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/config'
], function (ko, Config) {

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
            var parent = ko.dataFor(jQuery(event.target)[0]);
            console.log(parent);
        }
    };

    return Block;
});