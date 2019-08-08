/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnPreview from "../column/preview";
import {updateColumnWidth} from "../column/resize";
import ColumnGroupPreview from "./preview";

/**
 * Retrieve default  grid size
 *
 * @returns {number}
 */
export function getDefaultGridSize(): number {
    return parseInt(Config.getConfig("column_grid_default"), 10);
}

/**
 * Retrieve the max grid size
 *
 * @returns {number}
 */
export function getMaxGridSize(): number {
    return parseInt(Config.getConfig("column_grid_max"), 10);
}

/**
 * Apply the new grid size, adjusting the existing columns as needed.
 *
 * Rules for resizing the grid:
 *  - The grid size can be increased up to the configured maximum value.
 *  - The grid size can be decreased only if the number of non-empty columns is less than or equal to the new size.
 *  - If the new grid size is less than the number of columns currently in the grid, empty columns will be deleted
 *    to accommodate the new size.
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 * @param {Map<number, number[]>} gridSizeHistory
 */
export function resizeGrid(
    columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>,
    newGridSize: number,
    gridSizeHistory: Map<number, number[]>,
) {
    if (newGridSize === columnGroup.preview.getResizeUtils().getGridSize()) {
        return;
    }

    validateNewGridSize(columnGroup, newGridSize);

    // if we have more columns than the new grid size allows, remove empty columns until we are at the correct size
    if (newGridSize < columnGroup.getChildren()().length) {
        removeEmptyColumnsToFit(columnGroup, newGridSize);
    }
    columnGroup.preview.gridSize(newGridSize);

    // update column widths
    redistributeColumnWidths(columnGroup, newGridSize, gridSizeHistory);
}

/**
 * Validate that the new grid size is within the configured limits and can be achieved.
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 */
function validateNewGridSize(columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>, newGridSize: number) {
    // Validate against the max grid size
    if (newGridSize > getMaxGridSize()) {
        throw new GridSizeError($t(`The maximum grid size supported is ${getMaxGridSize()}.`));
    } else if (newGridSize < 2) {
        throw new GridSizeError($t("The minimum grid size supported is 2."));
    }

    // Validate that the operation will be successful
    const numCols = columnGroup.getChildren()().length;
    const currentGridSize = columnGroup.preview.getResizeUtils().getGridSize();
    if (newGridSize < currentGridSize && numCols > newGridSize) {
        let numEmptyColumns = 0;
        columnGroup.getChildren()().forEach(
            (column: ContentTypeCollectionInterface<ColumnPreview>) => {
                if (column.getChildren()().length === 0) {
                    numEmptyColumns++;
                }
            });
        if (newGridSize < numCols - numEmptyColumns) {
            throw new GridSizeError(
                $t("Grid size cannot be smaller than the current total amount of columns, minus any empty columns."),
            );
        }
    }
}

/**
 * Remove empty columns so we can accommodate the new grid size
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 */
function removeEmptyColumnsToFit(columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>, newGridSize: number) {
    const columns = columnGroup.getChildren()() as Array<ContentTypeCollectionInterface<ColumnPreview>>;
    let numColumns = columns.length;
    let i;
    for (i = numColumns - 1; i >= 0; i--) {
        const column: ContentTypeCollectionInterface<ColumnPreview> = columns[i];
        if (newGridSize < numColumns && column.getChildren()().length === 0) {
            columnGroup.removeChild(column);
            numColumns--;
        }
    }
}

/**
 * Adjust columns widths across the new grid size, making sure each column is at least one grid size in width
 * and the entire grid size is distributed.
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 * @param {Map<number, number[]>} gridSizeHistory
 */
function redistributeColumnWidths(
    columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>,
    newGridSize: number,
    gridSizeHistory: Map<number, number[]>,
) {
    // apply known column widths if we have resized before
    if (gridSizeHistory.has(newGridSize) &&
        gridSizeHistory.get(newGridSize).length === columnGroup.getChildren()().length) {
        const columnWidths: number[] = gridSizeHistory.get(newGridSize);
        columnGroup.getChildren()().forEach(
            (column: ContentTypeCollectionInterface<ColumnPreview>, index: number) => {
                updateColumnWidth(column, columnWidths[index]);
            });
        columnGroup.dataStore.set("grid_size", newGridSize);
        return;
    }

    const resizeUtils = columnGroup.preview.getResizeUtils();
    const existingGridSize = resizeUtils.getGridSize();
    const minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(
        Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0,
    );
    let totalNewWidths = 0;
    const numColumns = columnGroup.getChildren()().length;
    let remainingWidth: number = 0;
    columnGroup.getChildren()().forEach(
        (column: ContentTypeCollectionInterface<ColumnPreview>, index: number) => {
            const existingWidth = resizeUtils.getColumnWidth(column);
            const fractionColumnWidth = Math.round(existingWidth / (100 / existingGridSize));
            /**
             * Determine if the grid & column are directly compatible with the new defined grid size, this will directly
             * convert fractions to their equivalent of the new grid size.
             *
             * For instance changing a 12 column grid with 2 x 6 / 12 columns to a 6 grid is fully compatible.
             *
             * Check the existing grid size and new grid size are divisible, verify the amount of columns will fit
             * in the new grid size and finally check the calculation to convert the existing column width results in a
             * positive integer.
             */
            if (((existingGridSize > newGridSize && existingGridSize % newGridSize === 0)
                || (existingGridSize < newGridSize && newGridSize % existingGridSize === 0))
                && newGridSize % numColumns === 0
                && ((newGridSize / existingGridSize) * fractionColumnWidth) % 1 === 0
            ) {
                // We don't need to modify the columns width as it's directly compatible, we will however increment the
                // width counter as some other columns may not be compatible.
                totalNewWidths += existingWidth;
            } else {
                let newWidth = (100 * Math.floor((existingWidth / 100) * newGridSize) / newGridSize)
                    .toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);

                // make sure the column is at least one grid size wide
                if (parseFloat(newWidth) < parseFloat(minColWidth)) {
                    newWidth = minColWidth;
                }

                // make sure we leave enough space for other columns
                const maxAvailableWidth = 100 - totalNewWidths - ((numColumns - index - 1) * parseFloat(minColWidth));
                if (parseFloat(newWidth) > maxAvailableWidth) {
                    newWidth = maxAvailableWidth.toFixed(Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0);
                }

                // Calculate any width lost from the column, if a 5 / 12 is becoming a 2 / 6 then it's lost 1 / 12
                remainingWidth += (existingWidth - parseFloat(newWidth));

                /**
                 * Determine if we have enough remaining width, and apply it to the current column, this results in a
                 * subsequent column always receiving any additional width from the previous column
                 */
                if (resizeUtils.getSmallestColumnWidth(newGridSize)
                    === resizeUtils.getAcceptedColumnWidth(remainingWidth.toString(), newGridSize)
                ) {
                    const widthWithRemaining = resizeUtils.getAcceptedColumnWidth(
                        (parseFloat(newWidth) + remainingWidth).toString(),
                        newGridSize,
                    );
                    if (widthWithRemaining > 0) {
                        newWidth = widthWithRemaining
                            .toFixed(Math.round(100 / widthWithRemaining) !== 100 / widthWithRemaining ? 8 : 0);
                        remainingWidth = 0;
                    }
                }

                totalNewWidths += parseFloat(newWidth);
                updateColumnWidth(column, parseFloat(newWidth));
            }
            (column.preview as ColumnPreview).updateDisplayLabel();
        },
    );

    // persist new grid size so upcoming calls to get column widths are calculated correctly
    columnGroup.dataStore.set("grid_size", newGridSize);

    // apply leftover columns if the new grid size did not distribute evenly into existing columns
    if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
        applyLeftoverColumns(columnGroup, newGridSize);
    }
}

/**
 * Make sure the full grid size is distributed across the columns
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 */
function applyLeftoverColumns(columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>, newGridSize: number) {
    const resizeUtils = columnGroup.preview.getResizeUtils();
    const minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(
        Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0,
    );
    let column: ContentTypeCollectionInterface<ColumnPreview>;
    for (column of (columnGroup.getChildren()() as Array<ContentTypeCollectionInterface<ColumnPreview>>)) {
        if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
            updateColumnWidth(
                column,
                parseFloat(resizeUtils.getColumnWidth(column).toString()) + parseFloat(minColWidth),
            );
        } else {
            break;
        }
    }
}

export class GridSizeError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, GridSizeError.prototype);
    }
}
