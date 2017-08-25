import { AbstractStructural } from './abstract';
import { ColumnInterface } from './column.d';
import Config  from "../../config";
import { moveArrayItemIntoArray } from "../../../utils/array";
import { SortParams } from "./editable-area";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";

/**
 * Column class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Column extends AbstractStructural implements ColumnInterface {
    template: string = 'Gene_BlueFoot/component/stage/structural/column.html';

    // @todo determine how to merge with super
    options: Array<OptionInterface> = [
        new Option(this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10),
    ];

    columnDefinition: KnockoutObservable<object> = ko.observable(Config.getInitConfig('column_definitions')[0]);
    widthClasses: KnockoutComputed<string> = ko.computed(function (): string {
        return this.columnDefinition()['className'];
    }, this);
    serializedWidth: KnockoutComputed<number> = ko.computed(function () {
        return this.columnDefinition()['breakpoint'] * 100;
    }, this);

    /**
     * Add a column to self
     *
     * @param data
     * @returns {Column}
     */
    addColumn(data?: object): ColumnInterface {
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
    insertColumnAtIndex(direction: string, item: Column, data: object) {
        let index = ko.utils.arrayIndexOf(item.parent.children(), item),
            column = new Column(item.parent, item.parent.stage);

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
    updateColumnData(data: ColumnData): void {
        data = data || {};
        if (data.width) {
            let columnDef = Config.getColumnDefinitionByBreakpoint(data.width);
            if (columnDef) {
                this.columnDefinition(columnDef);
            }
        } else if (data.className) {
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
    onSortStart(event: Event, params: SortParams) {
        // Copy over the column class for the width
        jQuery(params.placeholder).addClass(this.widthClasses());

        return super.onSortStart(event, params);
    }
}

interface ColumnData {
    width?: number,
    className?: string
}