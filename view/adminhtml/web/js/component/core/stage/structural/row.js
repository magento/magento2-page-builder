/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/structural/column'
], function (Abstract, Column) {

    /**
     * @constructor
     */
    function Row() {
        Abstract.call(this);
    }
    Row.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    Row.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/row.html'
    };

    Row.prototype.addColumn = function () {
        this.children.push(new Column());
    };

    return Row;
});