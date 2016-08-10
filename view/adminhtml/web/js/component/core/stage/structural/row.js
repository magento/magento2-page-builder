/**
 * - Row.js
 * Structural row elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/structural/column',
    'mage/translate'
], function (Abstract, Column, $t) {

    /**
     * @constructor
     */
    function Row() {
        Abstract.call(this);
    }
    Row.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    /**
     * Build up the options available on a row
     */
    Row.prototype.buildOptions = function () {
        // Add column option
        this.options.addOption('column', '<i class="fa fa-columns"></i>', $t('Add Column'), this.addColumn.bind(this));
    };

    /**
     * Override template to row template
     *
     * @returns {string}
     */
    Row.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/row.html'
    };

    /**
     * Implement function to add columns to this element
     */
    Row.prototype.addColumn = function () {
        this.children.push(new Column());
    };

    return Row;
});