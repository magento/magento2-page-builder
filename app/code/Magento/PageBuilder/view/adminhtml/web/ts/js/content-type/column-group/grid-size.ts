/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnLinePreview from "../column-line/preview";
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
    if (newGridSize === columnGroup.preview.getResizeUtils().getInitialGridSize()) {
        return;
    }

    validateNewGridSize(columnGroup, newGridSize);

    columnGroup.getChildren()().forEach(
        (columnLine: ContentTypeCollectionInterface<ColumnLinePreview>, index: number) => {
            // if we have more columns than the new grid size allows, remove empty columns till the correct size
            console.log(columnLine.getChildren()().length);
            if (newGridSize < columnLine.getChildren()().length) {
                removeEmptyColumnsToFit(columnLine, newGridSize);
            }
        });

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

    let doThrowException = false;
    columnGroup.getChildren()().forEach(
        (columnLine: ContentTypeCollectionInterface<ColumnLinePreview>, index: number) => {
            let numEmptyColumns = 0;
            const numCols = columnLine.getChildren()().length;
            const currentGridSize = columnLine.preview.getResizeUtils().getInitialGridSize();
            if (newGridSize < currentGridSize && numCols > newGridSize) {
                columnLine.getChildren()().forEach(
                    (column: ContentTypeCollectionInterface<ColumnPreview>) => {
                    if (column.getChildren()().length === 0) {
                        numEmptyColumns++;
                    }
                });
                if (newGridSize < numCols - numEmptyColumns) {
                    doThrowException = true;
                }
            }
        });

    if (doThrowException) {
        throw new Error(
            $t("Grid size cannot be smaller than the current total amount of columns, minus any empty columns."),
        );
    }
}

/**
 * Remove empty columns so we can accommodate the new grid size
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 */
function removeEmptyColumnsToFit(columnLine: ContentTypeCollectionInterface<ColumnLinePreview>, newGridSize: number) {
    const columns = columnLine.getChildren()() as Array<ContentTypeCollectionInterface<ColumnPreview>>;
    let numColumns = columns.length;
    let i;
    for (i = numColumns - 1; i >= 0; i--) {
        const column: ContentTypeCollectionInterface<ColumnPreview> = columns[i];
        if (newGridSize < numColumns && column.getChildren()().length === 0) {
            columnLine.removeChild(column);
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
        columnGroup.dataStore.unset("initial_grid_size");
        return;
    }

    const columnGroupResizeUtil = columnGroup.preview.getResizeUtils();
    const existingGridSize = columnGroupResizeUtil.getInitialGridSize();
    const minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(
        Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0,
    );

    columnGroup.getChildren()().forEach(
        (columnLine: ContentTypeCollectionInterface<ColumnLinePreview>, columnLineIndex: number) => {
            let totalNewWidths = 0;
            let remainingWidth: number = 0;
            const numColumns = columnLine.getChildren()().length;
            const resizeUtils = columnLine.preview.getResizeUtils();
            columnLine.getChildren()().forEach(
            (column: ContentTypeCollectionInterface<ColumnPreview>, index: number) => {

                const existingWidth = resizeUtils.getColumnWidth(column);
                const fractionColumnWidth = Math.round(existingWidth / (100 / existingGridSize));
                /**
                 * Determine if the grid & column are directly compatible with the new defined grid size, this will
                 * directly convert fractions to their equivalent of the new grid size.
                 *
                 * For instance changing a 12 column grid with 2 x 6 / 12 columns to a 6 grid is fully compatible.
                 *
                 * Check the existing grid size and new grid size are divisible, verify the amount of columns will fit
                 * in the new grid size and finally check the calculation to convert the existing column width results
                 * in a positive integer.
                 */
                if (((existingGridSize > newGridSize && existingGridSize % newGridSize === 0)
                        || (existingGridSize < newGridSize && newGridSize % existingGridSize === 0))
                    && newGridSize % numColumns === 0
                    && ((newGridSize / existingGridSize) * fractionColumnWidth) % 1 === 0
                ) {
                    // We don't need to modify the columns width as it's compatible, we will however increment the
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
                    const widthTaken = totalNewWidths + ((numColumns - index - 1) * parseFloat(minColWidth));
                    const maxAvailableWidth = 100 - totalNewWidths;
                    if (parseFloat(newWidth) > maxAvailableWidth) {
                        const gridWidth = Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0;
                        newWidth = maxAvailableWidth.toFixed(gridWidth);
                    }

                    // Calculate any width lost from the column, if a 5 / 12 is becoming a 2 / 6 then it's lost 1 / 12
                    remainingWidth += (existingWidth - parseFloat(newWidth));

                    /**
                     * Determine if we have enough remaining width, and apply it to the current column, this results in
                     * a subsequent column always receiving any additional width from the previous column
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

            });
            },
    );

    columnGroup.dataStore.set("grid_size", newGridSize);
    columnGroup.dataStore.unset("initial_grid_size");
    columnGroup.getChildren()().forEach(
        (columnLine: ContentTypeCollectionInterface<ColumnLinePreview>, index: number) => {
            const resizeUtils = columnLine.preview.getResizeUtils();
            if (Math.round(resizeUtils.getColumnsWidth()) < 100) {
                applyLeftoverColumnsInColumnLine(columnLine, newGridSize);
            }
        },
    );
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

/**
 * Make sure the full grid size is distributed across the columns
 *
 * @param {ContentTypeCollectionInterface<Preview>} columnGroup
 * @param {number} newGridSize
 */
function applyLeftoverColumnsInColumnLine(
    columnLine: ContentTypeCollectionInterface<ColumnLinePreview>,
    newGridSize: number,
) {
    const resizeUtils = columnLine.preview.getResizeUtils();
    const minColWidth = parseFloat((100 / newGridSize).toString()).toFixed(
        Math.round(100 / newGridSize) !== 100 / newGridSize ? 8 : 0,
    );
    let column: ContentTypeCollectionInterface<ColumnPreview>;
    for (column of (columnLine.getChildren()() as Array<ContentTypeCollectionInterface<ColumnPreview>>)) {
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
