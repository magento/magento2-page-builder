import ko from 'knockout';
import Config from "../../../config";
/**
 * ColumnBuilder Class
 */
export class ColumnBuilder {
    /**
     * ColumnBuilder constructor
     */
    constructor() {
        this.position = ko.observable('');
        this.visible = ko.observable(false);
        this.sizes = ko.observableArray([]);
        this.template = 'Gene_BlueFoot/component/stage/structural/column/builder.html';
        const columnOptions = Config.getInitConfig("column_definitions");
        for (let i = 0; i < columnOptions.length; i++) {
            if (columnOptions[i].displayed === true) {
                this.sizes.push({
                    label: columnOptions[i].label,
                    className: columnOptions[i].className
                });
            }
        }
    }
    /**
     * Show the builder from the column options scope
     */
    showFromOption() {
        this.position('top');
        this.visible(true);
    }
    ;
    /**
     * Change the visibility to visible
     */
    show() {
        this.visible(true);
    }
    ;
    /**
     * Change the visibility to hidden
     */
    hide() {
        this.visible(false);
    }
    ;
    /**
     * Proxy to the correct parent's add column function
     */
    addColumn(parents, data) {
        // Nest a column (within a column or on a row)
        if (this.position() == 'top') {
            parents[1].addColumn(data);
        }
        else {
            // Add to left or right side of current column
            parents[1].insertColumnAtIndex(this.position(), parents[1], data);
        }
    }
    ;
}
