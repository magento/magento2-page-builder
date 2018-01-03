/**
 * Add column based on a selected size.
 */
define([
    'ko',
    'bluefoot/config'
], function (ko, Config) {

    /**
     * Column builder interface
     *
     * @constructor
     */
    function Builder() {
        this.position = ko.observable('');
        this.visible = ko.observable(false);

        // Build sizes to display
        this.sizes = ko.observableArray([]);
        this.buildOptions();
    }

    /**
     * Build the sizes available for column widths
     */
    Builder.prototype.buildOptions = function () {
        var columnOptions = Config.getInitConfig("column_definitions"),
            size = null;

        for (var i = 0; i < columnOptions.length; i++) {
            size = columnOptions[i];
            if (size.displayed === true) {
                this.sizes.push({
                    label: size.label,
                    className: size.className
                });
            }
        }
    };

    /**
     * Retrieve template path
     */
    Builder.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/column/builder.html'
    };

    /**
     * Show the builder from the column options scope
     */
    Builder.prototype.showFromOption = function (option, structure) {
        this.columnBuilder.position('top');
        this.columnBuilder.visible(true);
    };

    /**
     * Change the visibility to visible
     */
    Builder.prototype.show = function (option, structure) {
        this.visible(true);
    };

    /**
     * Change the visibility to hidden
     */
    Builder.prototype.hide = function () {
        this.visible(false);
    };

    /**
     * Proxy to the correct parent's add column function
     */
    Builder.prototype.addColumn = function (parents, data) {
        // Nest a column (within a column or on a row)
        if (this.position() == 'top') {
            parents[1].addColumn(data);
        } else {
            // Add to left or right side of current column
            parents[1].insertColumnAtIndex(this.position(), parents[1], data);
        }
    };

    return Builder;
});