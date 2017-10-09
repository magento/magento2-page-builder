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
    'bluefoot/utils/array',
    'bluefoot/stage/structural/options/column',
    'bluefoot/config'
], function (ko, AbstractStructural, $t, arrayUtil, ColumnOption, Config) {

    /**
     * Column structural block
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function Column(parent, stage) {
        AbstractStructural.call(this, parent, stage);
        this.ns = 'bluefoot/stage/structural/column';
        this.title = $t('Column');
        this.config = {
            code: 'column',
            name: $t('Column')
        };

        this.wrapperStyle = ko.observable({width: '100%'});
        this.columnDefinition = ko.observable(Config.getInitConfig('column_definitions')[0]);
        this.widthClasses = ko.computed(function () {
            return this.columnDefinition()['className'];
        }, this);

        this.serializedWidth = ko.computed(function () {
            return this.columnDefinition()['breakpoint'] * 100;
        }, this);

        this.serializeRole = 'column';
        var self = this;
        this.dataEntityData = [
            this.data,
            function () {
                return {width: self.serializedWidth()};
            }
        ];
        this.dataEntityDataIgnore = ['label', 'className'];
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
        this.options.addOption('column', '<i></i>', $t('Add Column'), this.columnBuilder.showFromOption.bind(this), ['add-column'], 50, ColumnOption);
    };

    /**
     * Copy data across to new instance
     *
     * @param duplicate
     * @returns {Column}
     */
    Column.prototype.duplicateData = function (duplicate) {
        // Run the parent
        $super.duplicateData.apply(this, arguments);

        // Copy over the wrapper style on duplicate
        duplicate.updateColumnData(this.data());
        return this;
    };

    /**
     * Override template to row template
     *
     * @returns {string}
     */
    Column.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/column.html'
    };

    /**
     * Implement function to add columns to this element
     */
    Column.prototype.addColumn = function (data) {
        var column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
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

        arrayUtil.moveArrayItemIntoArray(column, item.parent.children, index);
        column.updateColumnData(data);

        return column;
    };

    /**
     * Update the column data to reflect the correct width
     *
     * @param data
     */
    Column.prototype.updateColumnData = function (data) {
        data = data || {};
        if (data.width) {
            var columnDef = Config.getColumnDefinitionByBreakpoint(data.width);
            if (columnDef) {
                this.columnDefinition(columnDef);
            }
        } else if (data.className) {
            this.columnDefinition(Config.getColumnDefinitionByClassName(data.className));
        }

        this.data(data);
    };

    /**
     * Event called when sorting starts on this element
     *
     * @param event
     * @param params
     * @returns {*}
     */
    Column.prototype.onSortStart = function (event, params) {
        // Copy over the column class for the width
        jQuery(params.placeholder).addClass(this.widthClasses());

        // Run the parent
        return $super.onSortStart.apply(this, arguments);
    };

    return Column;
});