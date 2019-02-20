/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config.types";

let draggedContentTypeConfig: ContentTypeConfigInterface;

/**
 * Set the current dragged blocks config into the registry
 *
 * @param {ContentTypeConfigInterface} config
 */
export function setDraggedContentTypeConfig(config: ContentTypeConfigInterface): void {
    draggedContentTypeConfig = config;
}

/**
 * Retrieve the dragged blocks config
 *
 * @returns {ContentTypeConfigInterface}
 */
export function getDraggedContentTypeConfig(): ContentTypeConfigInterface {
    return draggedContentTypeConfig;
}
