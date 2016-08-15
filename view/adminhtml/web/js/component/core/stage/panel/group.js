/**
 * - Group.js
 * Group within the panel on the left side
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/panel/group/block'
], function (ko, Block) {

    /**
     * Groups that reside within the panel on the left side
     *
     * @param id
     * @param group
     * @constructor
     */
    function Group(id, group) {
        this.id = ko.observable(id);
        this.code = ko.observable(group.code);
        this.name = ko.observable(group.name);
        this.icon = ko.observable(group.icon);
        this.sort = ko.observable(group.sort);
        this.blocks = ko.observableArray([]);
    }

    /**
     * Add a child block into the group
     *
     * @param block
     */
    Group.prototype.addBlock = function (block) {
        this.blocks.push(new Block(block));
    };

    return Group;
});