/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "../content-type-config";

let draggedBlockConfig: ContentTypeConfigInterface;

/**
 * Set the current dragged blocks config into the registry
 *
 * @param {ContentTypeConfigInterface} config
 */
export function setDraggedBlockConfig(config: ContentTypeConfigInterface): void {
    draggedBlockConfig = config;
}

/**
 * Retrieve the dragged blocks config
 *
 * @returns {ContentTypeConfigInterface}
 */
export function getDraggedBlockConfig(): ContentTypeConfigInterface {
    return draggedBlockConfig;
}
