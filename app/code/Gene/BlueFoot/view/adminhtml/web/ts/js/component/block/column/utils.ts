import Config from "../../config";
import createBlock from "../factory";
import ColumnGroup from "../column-group";
import Column from "../column";

/**
 * Get the maximum columns allowed
 *
 * @returns {number}
 */
export function getMaxColumns() {
    return 6;
}

/**
 * Get the smallest column width possible
 *
 * @returns {number}
 */
export function getSmallestColumnWidth() {
    return getAcceptedColumnWidth(parseFloat(100 / getMaxColumns()).toFixed(
        Math.round(100 / getMaxColumns()) !== 100 / getMaxColumns() ? 8 : 0
    ));
}

/**
 * Get an accepted column width to resolve rounding issues, e.g. turn 49.995% into 50%
 *
 * @param width
 * @returns {number}
 */
export function getAcceptedColumnWidth(width) {
    let newWidth = 0;
    for (let i = getMaxColumns(); i > 0; i--) {
        const percentage = parseFloat((100 / getMaxColumns() * i).toFixed(
            Math.round((100 / getMaxColumns() * i)) !== (100 / getMaxColumns() * i) ? 8 : 0
        ));
        // Allow for rounding issues
        if (width > (percentage - 0.1) && width < (percentage + 0.1)) {
            newWidth = percentage;
            break;
        }
    }
    return newWidth;
}

/**
 * Return the width of the column
 *
 * @param {Column} column
 * @returns {number}
 */
export function getColumnWidth(column: Column): number {
    return parseFloat(column.stage.store.get(column.id).width);
}

/**
 * Create a column and add it to it's parent
 *
 * @param {ColumnGroup} parent
 * @param {number} width
 * @param {number} index
 * @returns {Promise<void>}
 */
export function createColumn(parent: ColumnGroup, width: number, index?: number) {
    return createBlock(
        Config.getContentTypeConfig('column'),
        parent,
        parent.stage,
        {width: parseFloat(width) + '%'}
    ).then((column) => {
        parent.addChild(column, index);
        return column;
    });
}
