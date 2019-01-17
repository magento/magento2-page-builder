/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnPreview from "../column/preview";
import ColumnGroupPreview from "./preview";

/**
 * Calculate the drop positions of a column group
 *
 * @param {ContentTypeCollectionInterface} group
 * @returns {any[]}
 */
export function calculateDropPositions(group: ContentTypeCollectionInterface<ColumnGroupPreview>): DropPosition[] {
    const resizeUtils = group.preview.getResizeUtils();
    const dropPositions: any[] = [];
    group.children().forEach((column: ContentTypeCollectionInterface<ColumnPreview>, index: number) => {
        const left = column.preview.element.position().left;
        const width = column.preview.element.outerWidth(true);
        const canShrink = resizeUtils.getAcceptedColumnWidth(resizeUtils.getColumnWidth(column).toString()) >
            resizeUtils.getSmallestColumnWidth();
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
