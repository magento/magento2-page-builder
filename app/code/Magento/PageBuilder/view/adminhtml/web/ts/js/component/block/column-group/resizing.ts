/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Column from "../column";
import {getAcceptedColumnWidth, getColumnWidth, getSmallestColumnWidth} from "../preview/column-group/resizing";

/**
 * Resize a column to a specific width
 *
 * @param {Column} column
 * @param {number} width
 * @param {Column} shrinkableColumn
 */
export function resizeColumn(column: Column, width: number, shrinkableColumn: Column) {
    const current = getColumnWidth(column);
    const difference = (parseFloat(width.toString()) - current).toFixed(8);

    // Don't run the update if we've already modified the column
    if (current === parseFloat(width.toString()) || parseFloat(width.toString()) < getSmallestColumnWidth()) {
        return;
    }

    // Also shrink the closest shrinkable column
    let allowedToShrink = true;
    if (difference && shrinkableColumn) {
        const currentShrinkable = getColumnWidth(shrinkableColumn);
        const shrinkableSize = getAcceptedColumnWidth((currentShrinkable + -difference).toString());

        // Ensure the column we're crushing is not becoming the same size, and it's not less than the smallest width
        if (currentShrinkable === parseFloat(shrinkableSize.toString())
            || parseFloat(shrinkableSize.toString()) < getSmallestColumnWidth()
        ) {
            allowedToShrink = false;
        } else {
            updateColumnWidth(
                shrinkableColumn,
                shrinkableSize,
            );
        }
    }

    if (allowedToShrink) {
        updateColumnWidth(column, width);
    }
}

/**
 * Update the width of a column
 *
 * @param {Column} column
 * @param {number} width
 */
export function updateColumnWidth(column: Column, width: number): void {
    column.store.updateKey(
        column.id,
        parseFloat(width.toString()) + "%",
        "width",
    );
}
