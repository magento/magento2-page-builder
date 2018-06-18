/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.d";

let dragColumn: ContentTypeCollectionInterface;

/**
 * Retrieve the drag column from the registry
 *
 * @returns {ContentTypeCollectionInterface}
 */
export function getDragColumn(): ContentTypeCollectionInterface {
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
 * @param {ContentTypeCollectionInterface} column
 */
export function setDragColumn(column: ContentTypeCollectionInterface) {
    dragColumn = column;
}
