/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
import Column from "../column/preview";

let dragColumn: Column;

/**
 * Retrieve the drag column from the registry
 *
 * @returns {Column}
 */
export function getDragColumn(): Column {
    return dragColumn;
}

/**
 * Remove the drag column reference
 */
export function removeDragColumn(): void {
    dragColumn = null;
}

/**
 * Set the drag column in the registry
 *
 * @param {Column} column
 */
export function setDragColumn(column: Column) {
    dragColumn = column;
}
