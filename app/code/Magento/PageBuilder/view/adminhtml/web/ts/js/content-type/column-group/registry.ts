/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnPreview from "../column/preview";

let dragColumn: ContentTypeCollectionInterface<ColumnPreview>;

/**
 * Retrieve the drag column from the registry
 *
 * @returns {ContentTypeCollectionInterface}
 */
export function getDragColumn(): ContentTypeCollectionInterface<ColumnPreview> {
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
 * @param {ContentTypeCollectionInterface<ColumnPreview>} column
 */
export function setDragColumn(column: ContentTypeCollectionInterface<ColumnPreview>) {
    dragColumn = column;
}
