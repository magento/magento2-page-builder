import { AbstractStructural } from './abstract';
import Config from "../../config";
import { moveArrayItemIntoArray } from "../../../utils/array";
import { Option } from "./options/option";
/**
 * Column class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Column extends AbstractStructural {
    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent, stage) {
        super(parent, stage);
        this.template = 'Gene_BlueFoot/component/stage/structural/column.html';
        this.columnDefinition = ko.observable(Config.getInitConfig('column_definitions')[0]);
        this.widthClasses = ko.computed(function () {
            return this.columnDefinition()['className'];
        }, this);
        this.serializedWidth = ko.computed(function () {
            return this.columnDefinition()['breakpoint'] * 100;
        }, this);
        this.options.push(new Option(this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10));
    }
    /**
     * Add a column to self
     *
     * @param data
     * @returns {Column}
     */
    addColumn(data) {
        let column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    }
    /**
     * Insert a column at a specific instance
     *
     * @param direction
     * @param item
     * @param data
     * @returns {Column}
     */
    insertColumnAtIndex(direction, item, data) {
        let index = ko.utils.arrayIndexOf(item.parent.children(), item), column = new Column(item.parent, item.parent.stage);
        if (direction == 'right') {
            ++index;
        }
        moveArrayItemIntoArray(column, item.parent.children, index);
        column.updateColumnData(data);
        return column;
    }
    /**
     * Update the column data to reflect the correct width
     *
     * @param data
     */
    updateColumnData(data) {
        data = data || {};
        if (data.width) {
            let columnDef = Config.getColumnDefinitionByBreakpoint(data.width);
            if (columnDef) {
                this.columnDefinition(columnDef);
            }
        }
        else if (data.className) {
            this.columnDefinition(Config.getColumnDefinitionByClassName(data.className));
        }
        this.data(data);
    }
    /**
     * Handle sort starting on column
     *
     * @param event
     * @param params
     * @returns {any}
     */
    onSortStart(event, params) {
        // Copy over the column class for the width
        jQuery(params.placeholder).addClass(this.widthClasses());
        return super.onSortStart(event, params);
    }
}
