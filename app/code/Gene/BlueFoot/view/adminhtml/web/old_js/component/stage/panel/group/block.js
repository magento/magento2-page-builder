/**
 * - Block.js
 * A block that resides inside a group within the panel
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/event-emitter',
    'ko'
], function (EventEmitter, ko) {

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

        this.droppable = true;

        EventEmitter.apply(this, arguments);
    }
    Block.prototype = Object.create(EventEmitter.prototype);

    return Block;
});