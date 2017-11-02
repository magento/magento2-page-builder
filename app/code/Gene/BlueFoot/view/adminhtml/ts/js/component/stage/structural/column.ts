/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Structural from './abstract';
import { ColumnInterface } from './column.d';
import Config  from "../../config";
import { moveArrayItemIntoArray } from "../../../utils/array";
import { SortParams } from "./editable-area";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import EditableArea from './editable-area';
import Stage from '../../stage';
import { DataObject } from "../../data-store";

import ko from 'knockout';

export class Column extends Structural implements ColumnInterface {
    previewTemplate: string = 'Gene_BlueFoot/component/block/preview/column.html';

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
    constructor(parent: EditableArea, stage: Stage) {
        super(parent, stage);
        this.options.push(
            new Option(this, 'column', '<i></i>', 'Add Column', this.addColumn.bind(this), ['add-column'], 10)
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