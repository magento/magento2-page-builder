/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Structural from './abstract';
import { ColumnInterface } from './column.d';
import { RowInterface } from "./row.d";
import { Column, ColumnData } from "./column";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import EditableArea from '../../stage/structural/editable-area'
import Stage from '../../stage';
import "ko-resizable";

/**
 * @deprecated use component/block/row.
 */
export default class Row extends Structural implements RowInterface {
    previewTemplate: string = 'Gene_BlueFoot/component/block/preview/row.html';
    renderTemplate: string = 'Gene_BlueFoot/component/block/render/row.html';

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent: EditableArea, stage: Stage) {
        super(parent, stage);

        this.config.name = 'row';
    }

    /**
     * Append an add column option
     *
     * @returns {Array<Option>}
     */
    get options(): Array<Option> {
        let options = super.options;
        options.push(
            new Option(this, 'column', '<i></i>', 'Add Column', this.addColumn, ['add-column'], 10)
        );
        return options;
    }

    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */
    addColumn(data?: ColumnData): ColumnInterface {
        let column = new Column(this, this.stage);
        column = this.onBlockDropped()
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    }
}