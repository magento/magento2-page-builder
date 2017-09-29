import ko from 'knockout';
import Config from "../../../config";
/**
 * ColumnBuilder Interface
 *
 */
export class ColumnBuilder {
    /**
     * ColumnBuilder constructor
     *
     */
    constructor() {
        this.position = ko.observable('');
        this.visible = ko.observable(false);
        this.sizes = ko.observableArray([]);
        /**
         * Build the sizes available for column widths
         */
        this.buildOptions = function () {
            const columnOptions = Config.getInitConfig("column_definitions");
            for (let i = 0; i < columnOptions.length; i++) {
                if (columnOptions[i].displayed === true) {
                    this.sizes.push({
                        label: columnOptions[i].label,
                        className: columnOptions[i].className
                    });
                }
            }
        };
        /**
         * Retrieve template path
         */
        this.getTemplate = function () {
            return 'Gene_BlueFoot/component/stage/structural/column/builder.html';
        };
        /**
         * Show the builder from the column options scope
         */
        this.showFromOption = function (option, structure) {
            this.position('top');
            this.visible(true);
        };
        /**
         * Change the visibility to visible
         */
        this.show = function (option, structure) {
            this.visible(true);
        };
        /**
         * Change the visibility to hidden
         */
        this.hide = function () {
            this.visible(false);
        };
        /**
         * Proxy to the correct parent's add column function
         */
        this.addColumn = function (parents, data) {
            // Nest a column (within a column or on a row)
            if (this.position() == 'top') {
                parents[1].addColumn(data);
            }
            else {
                // Add to left or right side of current column
                parents[1].insertColumnAtIndex(this.position(), parents[1], data);
            }
        };
        this.position = ko.observable('');
        // Build sizes to display
        this.sizes = ko.observableArray([]);
        this.buildOptions();
    }
}
