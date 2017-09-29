import { AbstractStructural } from './abstract';
import { ColumnInterface } from './column.d';
import { RowInterface } from "./row.d";
import { Column, ColumnData } from "./column";
import { Option } from "./options/option";
import { OptionInterface } from "./options/option.d";
import { EditableAreaInterface } from './editable-area.d';
import { StageInterface } from '../../stage.d';
import "ko-resizable";

/**
 * Row class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Row extends AbstractStructural implements RowInterface {
    template: string = 'Gene_BlueFoot/component/stage/structural/row.html';

    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent: EditableAreaInterface, stage: StageInterface) {
        super(parent, stage);
        
        this.options.push(
            new Option(this, 'column', '<i></i>', 'Add Column', this.addColumn.bind(this), ['add-column'], 10)
        );
    }

    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */
    addColumn(data?: ColumnData): ColumnInterface {
        let column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    }
}