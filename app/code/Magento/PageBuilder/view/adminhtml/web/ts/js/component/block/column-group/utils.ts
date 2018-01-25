/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Config from "../../config";
import Column from "../column";
import ColumnGroup from "../column-group";
import createBlock from "../factory";
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

    updateColumnWidth(column, width);

    // Also shrink the closest shrinkable column
    if (difference && shrinkableColumn) {
        const currentShrinkable = getColumnWidth(shrinkableColumn);
        updateColumnWidth(
            shrinkableColumn,
            getAcceptedColumnWidth((currentShrinkable + -difference).toString()),
        );
    }
}

/**
 * Update the width of a column
 *
 * @param {Column} column
 * @param {number} width
 */
export function updateColumnWidth(column: Column, width: number): void {
    column.stage.store.updateKey(
        column.id,
        parseFloat(width.toString()) + "%",
        "width",
    );
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
        Config.getContentTypeConfig("column"),
        parent,
        parent.stage,
        {width: parseFloat(width.toString()) + "%"},
    ).then((column) => {
        parent.addChild(column, index);
        return column;
    });
}
