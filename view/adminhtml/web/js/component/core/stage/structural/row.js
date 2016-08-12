/**
 * - Row.js
 * Structural row elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract',
    'bluefoot/stage/structural/column',
    'mage/translate',
    'bluefoot/stage/structural/options/column'
], function (Abstract, Column, $t, ColumnOption) {

    /**
     * Row structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Row(parent, stage) {
        Abstract.call(this, parent, stage);
    }
    Row.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    /**
     * Build up the options available on a row
     */
    Row.prototype.buildOptions = function () {
        // Run the parent
        $super.buildOptions.apply(this, arguments);

        // Add column option
        this.options.addOption(this, 'column', '<i class="fa fa-columns"></i>', $t('Add Column'), this.addColumn.bind(this), ['add-column'], 50, ColumnOption);
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
        this.children.push(new Column(this, this.stage));
    };

    return Row;
});