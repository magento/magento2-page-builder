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
    'bluefoot/common',
    'bluefoot/stage/structural/options/column',
    'bluefoot/config'
], function (ko, AbstractStructural, $t, Common, ColumnOption, Config) {

    /**
     * Column structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Column(parent, stage) {
        AbstractStructural.call(this, parent, stage);

        this.wrapperStyle = ko.observable({width: '100%'});
        this.widthClasses = ko.observable(Config.getInitConfig("column_definitions")[0]['className']);
    }

    Column.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    /**
     * Build up the options available on a row
     */
    Column.prototype.buildOptions = function () {
        // Run the parent
        $super.buildOptions.apply(this, arguments);

        // Add column option
        this.options.addOption(this, 'column', '<i class="fa fa-columns"></i>', $t('Add Column'), this.columnBuilder.showFromOption.bind(this), ['add-column'], 50, ColumnOption);
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
    Column.prototype.addColumn = function (data) {
        var column = new Column(this, this.stage);
        this.addChild(column);
        column.widthClasses(data.className);
    };

    /**
     * Insert a column at the designated index within it's parent
     */
    Column.prototype.insertColumnAtIndex = function (direction, item, data) {
        var index = ko.utils.arrayIndexOf(item.parent.children(), item),
            column = new Column(item.parent, item.parent.stage);

        if (direction == 'right') {
            ++index;
        }

        Common.moveArrayItemIntoArray(column, item.parent.children, index);
        column.widthClasses(data.className);
    };

    return Column;
});