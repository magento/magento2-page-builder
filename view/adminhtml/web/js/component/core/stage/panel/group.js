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

        // Active is used with mouse over events
        this.active = ko.observable(false);

        // Hidden is forced when an interaction is happening that requires the group to be hidden
        this.hidden = ko.observable(false);
    }

    /**
     * Add a child block into the group
     *
     * @param block
     */
    Group.prototype.addBlock = function (block) {
        this.blocks.push(new Block(block, this));
    };

    /**
     * On mouse over, make the group active
     */
    Group.prototype.onMouseOver = function () {
        this.active(true);
    };

    /**
     * On mouse out remove the active state of the group
     */
    Group.prototype.onMouseOut = function () {
        this.active(false);
    };

    return Group;
});