/**
 * - Column.js
 * Structural column elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/abstract',
    'mage/translate',
    'bluefoot/stage/structural/options/column'
], function (ko, Abstract, $t, ColumnOption) {

    /**
     * Column structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Column(parent, stage) {
        Abstract.call(this, parent, stage);

        this.wrapperStyle = ko.observable({width: '50%'});
        this.width = ko.observable(false);
    }
    Column.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    /**
     * Change the width of the column
     */
    Column.prototype.changeWidth = function () {
        this.updateWrapperStyle('width', '25%');
    };

    /**
     * Build up the options available on a row
     */
    Column.prototype.buildOptions = function () {
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
    Column.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/column.html'
    };

    /**
     * Implement function to add columns to this element
     */
    Column.prototype.addColumn = function () {
        this.children.push(new Column(this, this.stage));
    };

    return Column;
});