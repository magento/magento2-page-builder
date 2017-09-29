import { AbstractStructural } from './abstract';
import { Column } from "./column";
import { Option } from "./options/option";
import "ko-resizable";
/**
 * Row class
 *
 * @author Dave Macaulay <dmacaulay@magento.com>
 */
export default class Row extends AbstractStructural {
    /**
     * Abstract structural constructor
     *
     * @param parent
     * @param stage
     */
    constructor(parent, stage) {
        super(parent, stage);
        this.template = 'Gene_BlueFoot/component/stage/structural/row.html';
        this.options.push(new Option(this, 'column', '<i></i>', 'Add Column', this.addColumn.bind(this), ['add-column'], 10));
    }
    /**
     * Add a column to the row
     *
     * @param data
     * @returns {any}
     */
    addColumn(data) {
        let column = new Column(this, this.stage);
        this.addChild(column);
        column.updateColumnData(data);
        return column;
    }
}
