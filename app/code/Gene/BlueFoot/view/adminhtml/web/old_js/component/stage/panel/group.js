/**
 * - Group.js
 * Group within the panel on the left side
 *
 */
define([
    'ko',
    'underscore'
], function (ko, _) {

    /**
     * Groups that reside within the panel on the left side
     *
     * @param id
     * @param group
     * @param blocks
     * @constructor
     */
    function Group(id, group, blocks) {
        blocks = blocks || [];
        this.id = ko.observable(id);
        this.code = ko.observable(group.code);
        this.name = ko.observable(group.name);
        this.icon = ko.observable(group.icon);
        this.sort = ko.observable(group.sort);
        this.blocks = ko.observableArray(blocks);

        // Active is used with mouse over events
        this.active = ko.observable(false);

        // Hidden is forced when an interaction is happening that requires the group to be hidden
        this.hidden = ko.observable(false);
    }

    /**
     * Toggle the group open or closed
     */
    Group.prototype.toggle = function () {
        this.active(!this.active());
    };

    return Group;
});