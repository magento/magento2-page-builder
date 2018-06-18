/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.d";
import ColumnPreview from "../column/preview";
import ColumnGroupUtils from "./resizing";

/**
 * Calculate the drop positions of a column group
 *
 * @param {ContentTypeCollectionInterface} group
 * @returns {any[]}
 */
export function calculateDropPositions(group: ContentTypeCollectionInterface): DropPosition[] {
    const columnGroupUtils = new ColumnGroupUtils(group);
    const dropPositions: any[] = [];
    group.children().forEach((column: ContentTypeCollectionInterface<ColumnPreview>, index: number) => {
        const left = column.preview.element.position().left;
        const width = column.preview.element.outerWidth(true);
        const canShrink = columnGroupUtils.getAcceptedColumnWidth(columnGroupUtils.getColumnWidth(column).toString()) >
            columnGroupUtils.getSmallestColumnWidth();
        dropPositions.push(
            {
                affectedColumn: column, canShrink,
                insertIndex: index, left,
                placement: "left",
                right: left + (width / 2),
            },
            {
                affectedColumn: column, canShrink,
                insertIndex: index + 1,
                left: left + (width / 2),
                placement: "right",
                right: left + width,
            },
        );
    });
    return dropPositions;
}

export interface DropPosition {
    left: number;
    right: number;
    insertIndex: number;
    placement: string;
    affectedColumn: ContentTypeCollectionInterface<ColumnPreview>;
    canShrink: boolean;
}
