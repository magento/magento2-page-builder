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
    return getAcceptedColumnWidth(parseFloat((100 / getMaxColumns()).toString()).toFixed(
        Math.round(100 / getMaxColumns()) !== 100 / getMaxColumns() ? 8 : 0
    ));
}

/**
 * Get an accepted column width to resolve rounding issues, e.g. turn 49.995% into 50%
 *
 * @param width
 * @returns {number}
 */
export function getAcceptedColumnWidth(width: string) {
    let newWidth = 0;
    for (let i = getMaxColumns(); i > 0; i--) {
        const percentage = parseFloat((100 / getMaxColumns() * i).toFixed(
            Math.round((100 / getMaxColumns() * i)) !== (100 / getMaxColumns() * i) ? 8 : 0
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
 * @param {Column} column
 * @returns {number}
 */
export function getColumnWidth(column: Column): number {
    return parseFloat(column.stage.store.get(column.id).width.toString());
}

/**
 * Retrieve the index of the column within it's group
 *
 * @param {Column} column
 * @returns {number}
 */
export function getColumnIndexInGroup(column: Column): number {
    return column.parent.children().indexOf(column);
}

/**
 * Retrieve the adjacent column based on a direction of +1 or -1
 *
 * @param {Column} column
 * @param {"+1" | "-1"} direction
 * @returns {any}
 */
export function getAdjacentColumn(column: Column, direction: "+1" | "-1") {
    const currentIndex = getColumnIndexInGroup(column);
    if (typeof column.parent.children()[currentIndex + parseInt(direction)] !== 'undefined') {
        return column.parent.children()[currentIndex + parseInt(direction)];
    }
    return null;
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
        parseFloat(width.toString()) + '%',
        'width'
    );
}

/**
 * Calculate the drop positions of a column group
 *
 * @param {ColumnGroup} group
 * @returns {any[]}
 */
export function calculateDropPositions(group: ColumnGroup) {
    let dropPositions: any[] = [];
    group.children().forEach((column: Column, index: number) => {
        const left = column.element.position().left,
            width = column.element.outerWidth(),
            canShrink = getColumnWidth(column) > getSmallestColumnWidth();
        dropPositions.push(
            {
                left: left,
                right: left + (width / 2),
                insertIndex: index,
                placement: 'left',
                affectedColumn: column,
                canShrink: canShrink
            },
            {
                left: left + (width / 2),
                right: left + width,
                insertIndex: index + 1,
                placement: 'right',
                affectedColumn: column,
                canShrink: canShrink
            }
        );
    });
    return dropPositions;
}

/**
 * Return the column width to 8 decimal places if it's not a whole number
 *
 * @param {number} width
 * @returns {string}
 */
export function getRoundedColumnWidth(width: number): string {
    return (width).toFixed(
        Math.round(width) !== width ? 8 : 0
    );
}

/**
 * Get the total width of all columns in the group
 *
 * @param {ColumnGroup} group
 * @returns {number}
 */
export function getColumnsWidth(group: ColumnGroup): number {
    return group.children().map((column: Column) => {
        return getColumnWidth(column);
    }).reduce((widthA, widthB) => {
        return widthA + (widthB ? widthB : 0);
    });
}

/**
 * Determine the pixel position of every column that can be created within the group
 *
 * @param {Column} column
 * @param {JQuery} group
 * @returns {any[]}
 */
export function determineColumnWidths(column: Column, group: JQuery) {
    const columnWidth = group.width() / getMaxColumns(),
        groupLeftPos = column.element.offset().left;
    let columnWidths = [];

    for (let i = getMaxColumns(); i > 0; i--) {
        columnWidths.push({
            position: Math.round(groupLeftPos + columnWidth * i),
            name: i + '/' + getMaxColumns(),
            width: getRoundedColumnWidth(100 / getMaxColumns() * i)
        });
    }

    return columnWidths;
}

/**
 * Resize a column to a specific width
 *
 * @param {Column} column
 * @param {number} width
 */
export function resizeColumn(column: Column, width: number) {
    const current = getColumnWidth(column),
        difference = (parseFloat(width.toString()) - current).toFixed(8);

    // Don't run the update if we've already modified the column
    if (current === parseFloat(width.toString())) {
        return;
    }

    updateColumnWidth(column, width);

    if (difference) {
        resizeAdjacentColumn(column, difference);
    }
}

/**
 * Resize the adjacent column to the current
 *
 * @param {Column} column
 * @param {number} difference
 */
function resizeAdjacentColumn(column: Column, difference: string) {
    const columnChildren = column.parent.children(),
        columnIndex = columnChildren.indexOf(column);
    if (typeof columnChildren[columnIndex + 1] !== 'undefined') {
        const adjacentColumn: Column = (columnChildren[columnIndex + 1] as Column),
            currentAdjacent = getColumnWidth(adjacentColumn);
        let newWidth = currentAdjacent + -difference;

        updateColumnWidth(adjacentColumn, getAcceptedColumnWidth(newWidth.toString()));
    }
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
        {width: parseFloat(width.toString()) + '%'}
    ).then((column) => {
        parent.addChild(column, index);
        return column;
    });
}