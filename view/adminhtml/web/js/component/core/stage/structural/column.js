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
    'bluefoot/stage/structural/options/column',
    'bluefoot/config'
], function (ko, Abstract, $t, ColumnOption, Config) {

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
        this.widthClasses = ko.observable( Config.getInitConfig("column_definitions")[0]['className'] );
        this.newColumnOptions = {
            sizes: ko.observableArray([]),
            visible: ko.observable(false),
            side: ko.observable('right')
        };
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
        this.addChild(new Column(this, this.stage));
    };

    /**
     * Function to add an new column on the left or right-hand side of an existing column
     * @param side
     */
    Column.prototype.showColumnBuilder = function (side) {
        var index = ko.utils.arrayIndexOf(this.parent.children(), this);
        if (side == 'right') {
            ++index;
        }

        var columnOptions = Config.getInitConfig("column_definitions"),
            sizes = [],
            size = null;

        for(var i=0; i < columnOptions.length; i++) {
            size = columnOptions[i];
            if( size.displayed === true ) {
                sizes.push({
                    label: size.label,
                    className: size.className,
                    index: index
                });
            }
        }

        this.newColumnOptions.visible(true);
        this.newColumnOptions.sizes(sizes);
        this.newColumnOptions.side(side == 'right' ? 'right' : 'left');
    };

    /**
     * Insert a column at the designated index within it's parent
     * @param parent
     * @param data
     */
    Column.prototype.insertColumnAtIndex = function(parent, data) {
        // at this point 'parent' refers to the current column,
        // so we need to go up another layer to get the row/column's parent so that the column is inserted within
        // the current column
        var originalParent = parent;
        parent = parent.parent;

        if (data.index > -1) {
            var column = new Column(parent, parent.stage);
            parent.children.splice(data.index, 0, column);
            column.widthClasses(data.className);
        }

        originalParent.newColumnOptions.visible(false);
    };

    return Column;
});