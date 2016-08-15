/**
 * - Options/Column.js
 * Handles the column logic
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/options/option'
], function (ko, Option) {

    /**
     * Column option constructor
     *
     * @param parent
     * @param code
     * @param icon
     * @param title
     * @param callbackFn
     * @param additionalClasses
     * @param sort
     * @constructor
     */
    function ColumnOption(parent, code, icon, title, callbackFn, additionalClasses, sort) {
        Option.call(this, parent, code, icon, title, callbackFn, additionalClasses, sort);

        // Override the options template to use our column template
        this.template = 'Gene_BlueFoot/component/core/stage/structural/options/column.html';
        this.active = ko.observable(false);
    }
    ColumnOption.prototype = Object.create(Option.prototype);
    var $super = Option.prototype;

    /**
     * Add a column into the parent
     */
    ColumnOption.prototype.addColumn = function () {
        return this.parent.addColumn();
    };

    /**
     * On mouse over display the column UI
     */
    ColumnOption.prototype.onMouseOver = function () {
        this.active(true);
    };

    /**
     * On mouse out hide the column UI
     */
    ColumnOption.prototype.onMouseOut = function () {
        this.active(false);
    };

    return ColumnOption;
});