import ko from 'knockout';
import Config from "../../../config";

/**
 * ColumnBuilder Interface
 *
 */
export class ColumnBuilder {
    position: KnockoutObservable<string> = ko.observable('');
    visible: KnockoutObservable<boolean> = ko.observable(false);
    sizes: KnockoutObservableArray<object> = ko.observableArray([]);

    /**
     * ColumnBuilder constructor
     *
     */
    constructor() {
        this.position = ko.observable('');
        // Build sizes to display
        this.sizes = ko.observableArray([]);
        this.buildOptions();
    }

    /**
     * Build the sizes available for column widths
     */
    buildOptions = function () {
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
    getTemplate = function () {
        return 'Gene_BlueFoot/component/stage/structural/column/builder.html'
    };

    /**
     * Show the builder from the column options scope
     */
    showFromOption = function (option: any, structure: any) {
        this.position('top');
        this.visible(true);
    };

    /**
     * Change the visibility to visible
     */
    show = function (option: any, structure: any) {
        this.visible(true);
    };

    /**
     * Change the visibility to hidden
     */
    hide = function () {
        this.visible(false);
    };

    /**
     * Proxy to the correct parent's add column function
     */
    addColumn = function (parents: any, data: any) {
        // Nest a column (within a column or on a row)
        if (this.position() == 'top') {
            parents[1].addColumn(data);
        } else {
            // Add to left or right side of current column
            parents[1].insertColumnAtIndex(this.position(), parents[1], data);
        }
    };

}