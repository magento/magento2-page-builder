import ContentTypeConfigInterface from "../content-type-config";

/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

let draggedBlockConfig: ContentTypeConfigInterface;

export function setDraggedBlockConfig(config: ContentTypeConfigInterface): void {
    draggedBlockConfig = config;
}

export function getDraggedBlockConfig(): ContentTypeConfigInterface {
    return draggedBlockConfig;
}
