/**
 * - Column.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract'
], function (Abstract) {

    /**
     * @constructor
     */
    function Column() {
        Abstract.call(this);
    }
    Column.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    Column.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/column.html'
    };

    Column.prototype.addColumn = function () {
        this.children.push(new Column());
    };

    return Column;
});