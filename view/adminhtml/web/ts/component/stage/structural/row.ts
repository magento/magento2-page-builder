import { AbstractStructural } from './abstract';
import { ColumnInterface } from './column.d';
import { RowInterface } from "./row.d";
import { Column } from "./column";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";

/**
 * Row class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export class Row extends AbstractStructural implements RowInterface {
    template: string = 'Gene_BlueFoot/component/stage/structural/row.html';

    // @todo determine how to merge with super
    options: Array<OptionInterface> = [
        new Option(this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10),
    ];

    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */
    addColumn(data?: object): ColumnInterface {
        let column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    }
}