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
    constructor() {
        super(...arguments);
        this.template = 'Gene_BlueFoot/component/stage/structural/row.html';
        // @todo determine how to merge with super
        this.options = [
            new Option(this, 'column', '<i></i>', 'Add Column', false, ['add-column'], 10),
        ];
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
