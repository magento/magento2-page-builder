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
    'bluefoot/stage/structural/options/column',
    'bluefoot/config',
    'bluefoot/ko-resizable'
], function (AbstractStructural, Column, $t, ColumnOption, Config) {

    /**
     * Row structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Row(parent, stage) {
        AbstractStructural.call(this, parent, stage);
        this.ns = 'bluefoot/stage/structural/row';
        this.title = $t('Row');
        this.config = {
            code: 'row',
            name: $t('Row')
        };

        this.serializeRole = 'row';
    }

    Row.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    /**
     * Build up the options available on a row
     */
    Row.prototype.buildOptions = function () {
        // Run the parent
        $super.buildOptions.apply(this, arguments);

        // Add column option
        this.options.addOption('column', '<i></i>', $t('Add Column'), this.columnBuilder.showFromOption.bind(this), ['add-column'], 50, ColumnOption);
    };

    /**
     * Override template to row template
     *
     * @returns {string}
     */
    Row.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/row.html'
    };

    /**
     * Implement function to add columns to this element
     */
    Row.prototype.addColumn = function (data) {
        var column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    };

    return Row;
});