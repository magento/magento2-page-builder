/**
 * - Column.js
 * Structural column elements
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

    /**
     * Override template to row template
     *
     * @returns {string}
     */
    Column.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/column.html'
    };

    /**
     * Implement function to add columns to this element
     */
    Column.prototype.addColumn = function () {
        this.children.push(new Column());
    };

    return Column;
});