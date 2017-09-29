import { AbstractStructural } from './abstract';
import { ColumnInterface } from './column.d';
import Config  from "../../config";
import { moveArrayItemIntoArray } from "../../../utils/array";
import { SortParams } from "./editable-area";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import { EditableAreaInterface } from './editable-area.d';
import { StageInterface } from '../../stage.d';
import { DataObject } from "../../data-store";

/**
 * Column class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Column extends AbstractStructural implements ColumnInterface {
    template: string = 'Gene_BlueFoot/component/stage/structural/column.html';

    columnDefinition: KnockoutObservable<object> = ko.observable(Config.getInitConfig('column_definitions')[0]);
    widthClasses: KnockoutComputed<string> = ko.computed(function (): string {
        return this.columnDefinition()['className'];
    }, this);
    serializedWidth: KnockoutComputed<number> = ko.computed(function () {
        return this.columnDefinition()['breakpoint'] * 100;
    }, this);

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent: EditableAreaInterface, stage: StageInterface) {
        super(parent, stage);
        
        this.options.push(
            new Option(this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10)
        );
    }

    /**
     * Add a column to self
     *
     * @param data
     * @returns {Column}
     */
    addColumn(data?: ColumnData): ColumnInterface {
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
    insertColumnAtIndex(direction: string, item: Column, data: ColumnData) {
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

        this.stage.store.update(this.id, data);
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

export interface ColumnData extends DataObject {
    width?: number,
    className?: string
}