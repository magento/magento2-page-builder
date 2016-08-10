/**
 * - Column.js
 * Structural column elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/stage/structural/abstract',
    'mage/translate'
], function (Abstract, $t) {

    /**
     * @constructor
     */
    function Column() {
        Abstract.call(this);
    }
    Column.prototype = Object.create(Abstract.prototype);
    var $super = Abstract.prototype;

    /**
     * Build up the options available on a row
     */
    Column.prototype.buildOptions = function () {
        // Add column option
        this.options.addOption('column', '<i class="fa fa-columns"></i>', $t('Add Column'), this.addColumn.bind(this));

        // Run the parent
        $super.buildOptions.apply(this, arguments);
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
        this.children.push(new Column());
    };

    return Column;
});