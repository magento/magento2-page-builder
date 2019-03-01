/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.types";
import {outwardSearch} from "../../utils/array";
import {ColumnWidth, GroupPositionCache, MaxGhostWidth, ResizeHistory} from "../column-group/preview";
import ColumnPreview from "./preview";

export default class Resize {
    private columnGroup: ContentTypeCollectionInterface;

    constructor(columnGroup: ContentTypeCollectionInterface) {
        this.columnGroup = columnGroup;
    }

    /**
     * Get the grid size for this columnGroup
     *
     * @returns {number}
     */
    public getGridSize(): number {
        return parseInt(this.columnGroup.dataStore.get("grid_size").toString(), 10);
    }

    /**
     * Get the smallest column width possible
     *
     * @param {number} gridSize
     * @returns {number}
     */
    public getSmallestColumnWidth(gridSize?: number): number {
        gridSize = gridSize || this.getGridSize();
        return this.getAcceptedColumnWidth(parseFloat((100 / gridSize).toString()).toFixed(
            Math.round(100 / gridSize) !== 100 / gridSize ? 8 : 0,
        ));
    }

    /**
     * Get an accepted column width to resolve rounding issues, e.g. turn 49.995% into 50%
     *
     * @param {string} width
     * @param {number} gridSize
     * @returns {number}
     */
    public getAcceptedColumnWidth(width: string, gridSize?: number): number {
        gridSize = gridSize || this.getGridSize();
        let newWidth = 0;
        for (let i = gridSize; i > 0; i--) {
            const percentage = parseFloat((100 / gridSize * i).toFixed(
                Math.round((100 / gridSize * i)) !== (100 / gridSize * i) ? 8 : 0,
            ));
            // Allow for rounding issues
            if (parseFloat(width) > (percentage - 0.1) && parseFloat(width) < (percentage + 0.1)) {
                newWidth = percentage;
                break;
            }
        }
        return newWidth;
    }

    /**
     * Return the width of the column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {number}
     */
    public getColumnWidth(column: ContentTypeCollectionInterface<ColumnPreview>): number {
        return this.getAcceptedColumnWidth(column.dataStore.get("width").toString());
    }

    /**
     * Get the total width of all columns in the group
     *
     * @returns {number}
     */
    public getColumnsWidth(): number {
        return this.getAcceptedColumnWidth(
            this.columnGroup.children().map((column: ContentTypeCollectionInterface<ColumnPreview>) => {
                return this.getColumnWidth(column);
            }).reduce((widthA: number, widthB: number) => {
                return widthA + (widthB ? widthB : 0);
            }).toString(),
        );
    }

    /**
     * Determine the pixel position of every column that can be created within the group
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {GroupPositionCache} groupPosition
     * @returns {ColumnWidth[]}
     */
    public determineColumnWidths(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        groupPosition: GroupPositionCache,
    ): ColumnWidth[] {
        const gridSize = this.getGridSize();
        const singleColumnWidth = groupPosition.outerWidth / gridSize;
        const adjacentColumn = getAdjacentColumn(column, "+1");
        const columnWidths = [];
        const columnLeft = column.preview.element.offset().left
            - parseInt(column.preview.element.css("margin-left"), 10);
        const adjacentRightPosition = adjacentColumn.preview.element.offset().left +
            adjacentColumn.preview.element.outerWidth(true);

        // Determine the maximum size (in pixels) that this column can be dragged to
        const columnsToRight = column.parentContentType.children().length - (getColumnIndexInGroup(column) + 1);
        const leftMaxWidthFromChildren = groupPosition.left + groupPosition.outerWidth -
            (columnsToRight * singleColumnWidth) + 10;
        const rightMaxWidthFromChildren = groupPosition.left +
            (column.parentContentType.children().length - columnsToRight) * singleColumnWidth - 10;
        // Due to rounding we add a threshold of 10

        // Iterate through the amount of columns generating the position for both left & right interactions
        for (let i = gridSize; i > 0; i--) {
            const position = Math.round(columnLeft + (singleColumnWidth * i));
            if (position > Math.round(leftMaxWidthFromChildren)) {
                continue;
            }
            columnWidths.push(
                {
                    forColumn: "left", // These positions are for the left column in the pair
                    name: i + "/" + gridSize,
                    position,
                    width: getRoundedColumnWidth(100 / gridSize * i),
                },
            );
        }

        for (let i = 1; i < gridSize; i++) {
            const position = Math.floor(adjacentRightPosition - (i * singleColumnWidth));
            if (position < Math.floor(rightMaxWidthFromChildren)) {
                continue;
            }
            // The right interaction is only used when we're crushing a column that isn't adjacent
            columnWidths.push(
                {
                    forColumn: "right", // These positions are for the left column in the pair
                    name: i + "/" + gridSize,
                    position,
                    width: getRoundedColumnWidth(100 / gridSize * i),
                },
            );
        }

        return columnWidths;
    }

    /**
     * Find a column which can be shrunk for the current resize action
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {"left" | "right"} direction
     * @returns {ContentTypeCollectionInterface<ColumnPreview>}
     */
    public findShrinkableColumnForResize(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        direction: "left" | "right",
    ): ContentTypeCollectionInterface<ColumnPreview> {
        const currentIndex = getColumnIndexInGroup(column);
        const columnItemsArray = column.parentContentType.children();
        let searchArray: Array<ContentTypeCollectionInterface<ColumnPreview>>;
        switch (direction) {
            case "right":
                searchArray =
                    columnItemsArray.slice(currentIndex + 1) as Array<ContentTypeCollectionInterface<ColumnPreview>>;
                break;
            case "left":
                searchArray = columnItemsArray.slice(0).reverse().slice(columnItemsArray.length - currentIndex) as
                    Array<ContentTypeCollectionInterface<ColumnPreview>>;
                break;
        }
        return searchArray.find((groupColumn: ContentTypeCollectionInterface<ColumnPreview>) => {
            return this.getColumnWidth(groupColumn) > this.getSmallestColumnWidth();
        });
    }

    /**
     * Find a shrinkable column outwards from the current column
     *
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @returns {ContentTypeCollectionInterface<ColumnPreview>}
     */
    public findShrinkableColumn(
        column: ContentTypeCollectionInterface<ColumnPreview>,
    ): ContentTypeCollectionInterface<ColumnPreview> {
        return outwardSearch(
            column.parentContentType.children(),
            getColumnIndexInGroup(column),
            (neighbourColumn) => {
                return this.getColumnWidth(neighbourColumn) > this.getSmallestColumnWidth();
            },
        );
    }

    /**
     * Calculate the ghost size for the resizing action
     *
     * @param {GroupPositionCache} groupPosition
     * @param {number} currentPos
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {string} modifyColumnInPair
     * @param {MaxGhostWidth} maxGhostWidth
     * @returns {number}
     */
    public calculateGhostWidth(
        groupPosition: GroupPositionCache,
        currentPos: number,
        column: ContentTypeCollectionInterface<ColumnPreview>,
        modifyColumnInPair: string,
        maxGhostWidth: MaxGhostWidth,
    ): number {
        let ghostWidth = currentPos - groupPosition.left;

        switch (modifyColumnInPair) {
            case "left":
                const singleColumnWidth = column.preview.element.position().left
                    + groupPosition.outerWidth / this.getGridSize();
                // Don't allow the ghost widths be less than the smallest column
                if (ghostWidth <= singleColumnWidth) {
                    ghostWidth = singleColumnWidth;
                }

                if (currentPos >= maxGhostWidth.left) {
                    ghostWidth = maxGhostWidth.left - groupPosition.left;
                }
                break;
            case "right":
                if (currentPos <= maxGhostWidth.right) {
                    ghostWidth = maxGhostWidth.right - groupPosition.left;
                }
                break;
        }

        return ghostWidth;
    }

    /**
     * Determine which column in the group should be adjusted for the current resize action
     *
     * @param {number} currentPos
     * @param {ContentTypeCollectionInterface<ColumnPreview>} column
     * @param {ResizeHistory} history
     * @returns {[ContentTypeCollectionInterface<ColumnPreview>, string, string]}
     */
    public determineAdjustedColumn(
        currentPos: number,
        column: ContentTypeCollectionInterface<ColumnPreview>,
        history: ResizeHistory,
    ): [ContentTypeCollectionInterface<ColumnPreview>, string, string] {
        let modifyColumnInPair: string = "left";
        let usedHistory: string;
        const resizeColumnLeft = column.preview.element.offset().left
            - parseInt(column.preview.element.css("margin-left"), 10);
        const resizeColumnWidth = column.preview.element.outerWidth(true);
        const resizeHandlePosition = resizeColumnLeft + resizeColumnWidth;

        let adjustedColumn: ContentTypeCollectionInterface<ColumnPreview>;
        if (currentPos >= resizeHandlePosition) {
            // Get the history for the opposite direction of resizing
            if (history.left.length > 0) {
                usedHistory = "left";
                adjustedColumn = history.left.reverse()[0].adjustedColumn;
                modifyColumnInPair = history.left.reverse()[0].modifyColumnInPair;
            } else {
                // If we're increasing the width of our column we need to locate a column that can shrink to the
                // right
                adjustedColumn = this.findShrinkableColumnForResize(column, "right");
            }
        } else {
            if (this.getColumnWidth(column) <= this.getSmallestColumnWidth()) {
                adjustedColumn = this.findShrinkableColumnForResize(column, "left");
                if (adjustedColumn) {
                    modifyColumnInPair = "right";
                }
            } else if (history.right.length > 0) {
                usedHistory = "right";
                adjustedColumn = history.right.reverse()[0].adjustedColumn;
                modifyColumnInPair = history.right.reverse()[0].modifyColumnInPair;
            } else {
                // If we're shrinking our column we can just increase the adjacent column
                adjustedColumn = getAdjacentColumn(column, "+1");
            }
        }

        return [adjustedColumn, modifyColumnInPair, usedHistory];
    }

    /**
     * Resize a column to a specific width
     *
     * @param {ContentTypeCollectionInterface<Preview>} column
     * @param {number} width
     * @param {ContentTypeCollectionInterface<Preview>} shrinkableColumn
     */
    public resizeColumn(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        width: number,
        shrinkableColumn: ContentTypeCollectionInterface<ColumnPreview>,
    ): void {
        const current = this.getColumnWidth(column);
        const difference = (parseFloat(width.toString()) - current).toFixed(8);

        // Don't run the update if we've already modified the column
        if (current === parseFloat(width.toString()) || parseFloat(width.toString()) < this.getSmallestColumnWidth()) {
            return;
        }

        // Also shrink the closest shrinkable column
        let allowedToShrink = true;
        if (difference && shrinkableColumn) {
            const currentShrinkable = this.getColumnWidth(shrinkableColumn);
            const shrinkableSize = this.getAcceptedColumnWidth((currentShrinkable + -difference).toString());

            // Ensure the column we're crushing is not becoming the same size, and it's not less than the smallest width
            if ((currentShrinkable === parseFloat(shrinkableSize.toString())
                || parseFloat(shrinkableSize.toString()) < this.getSmallestColumnWidth())
            ) {
                allowedToShrink = false;
            } else {
                // Ensure we're not creating more columns width than the grid can support
                if (this.gridSupportsResize(column, width, shrinkableColumn, shrinkableSize)) {
                    updateColumnWidth(shrinkableColumn, shrinkableSize);
                } else {
                    allowedToShrink = false;
                }
            }
        }

        if (allowedToShrink) {
            updateColumnWidth(column, width);
        }
    }

    /**
     * Determine if the grid supports the new proposed grid size
     *
     * @param {ContentTypeCollectionInterface<Preview>} column
     * @param {number} newWidth
     * @param {ContentTypeCollectionInterface<Preview>} shrinkableColumn
     * @param {number} shrinkableColumnNewWidth
     * @returns {boolean}
     */
    private gridSupportsResize(
        column: ContentTypeCollectionInterface<ColumnPreview>,
        newWidth: number,
        shrinkableColumn?: ContentTypeCollectionInterface<ColumnPreview>,
        shrinkableColumnNewWidth?: number,
    ) {
        // Determine the total width of all other columns in the grid, excluding the ones we plan to resize
        const otherColumnsWidth = column.parentContentType.getChildren()().filter((gridColumn) => {
            return gridColumn !== column && (shrinkableColumn && gridColumn !== shrinkableColumn);
        }).map((otherColumn: ContentTypeCollectionInterface<ColumnPreview>) => {
            return this.getColumnWidth(otherColumn);
        }).reduce((a: number, b: number) => {
            return a + b;
        }, 0);

        // Determine if the new total grid size will be 100%, with 1 for margin of error with rounding
        return comparator(
            otherColumnsWidth + newWidth + (shrinkableColumnNewWidth ? shrinkableColumnNewWidth : 0),
            100,
            0.1,
        );
    }
}

/**
 * Retrieve the index of the column within it's group
 *
 * @param {ContentTypeCollectionInterface<ColumnPreview>} column
 * @returns {number}
 */
export function getColumnIndexInGroup(column: ContentTypeCollectionInterface<ColumnPreview>): number {
    return column.parentContentType.children().indexOf(column);
}

/**
 * Retrieve the adjacent column based on a direction of +1 or -1
 *
 * @param {ContentTypeCollectionInterface<Preview>} column
 * @param {"+1" | "-1"} direction
 * @returns {ContentTypeCollectionInterface<Preview>}
 */
export function getAdjacentColumn(
    column: ContentTypeCollectionInterface<ColumnPreview>,
    direction: "+1" | "-1",
): ContentTypeCollectionInterface<ColumnPreview> {
    const currentIndex = getColumnIndexInGroup(column);
    if (typeof column.parentContentType.children()[currentIndex + parseInt(direction, 10)] !== "undefined") {
        return column.parentContentType.children()[currentIndex + parseInt(direction, 10)] as
            ContentTypeCollectionInterface<ColumnPreview>;
    }
    return null;
}

/**
 * Determine the max ghost width based on the calculated columns
 *
 * @param {ColumnWidth[]} columnWidths
 * @returns {MaxGhostWidth}
 */
export function determineMaxGhostWidth(columnWidths: ColumnWidth[]): MaxGhostWidth {
    const leftColumns = columnWidths.filter((width) => {
        return width.forColumn === "left";
    });
    const rightColumns = columnWidths.filter((width) => {
        return width.forColumn === "right";
    });
    return {
        left: leftColumns[0].position,
        right: rightColumns[rightColumns.length - 1].position,
    };
}

/**
 * Return the column width to 8 decimal places if it's not a whole number
 *
 * @param {number} width
 * @returns {string}
 */
export function getRoundedColumnWidth(width: number): number {
    return Number((width).toFixed(
        Math.round(width) !== width ? 8 : 0,
    ));
}

/**
 * Compare if two numbers are within a certain threshold of each other
 *
 * comparator(10,11,2) => true
 * comparator(1.1,1.11,0.5) => true
 *
 * @param {number} num1
 * @param {number} num2
 * @param {number} threshold
 * @returns {boolean}
 */
export function comparator(num1: number, num2: number, threshold: number): boolean {
    return (num1 > (num2 - (threshold / 2)) && num1 < (num2 + (threshold / 2)));
}

/**
 * Update the width of a column
 *
 * @param {ContentTypeCollectionInterface<ColumnPreview>} column
 * @param {number} width
 */
export function updateColumnWidth(column: ContentTypeCollectionInterface<ColumnPreview>, width: number): void {
    column.dataStore.set(
        "width",
        parseFloat(width.toString()) + "%",
    );
}
