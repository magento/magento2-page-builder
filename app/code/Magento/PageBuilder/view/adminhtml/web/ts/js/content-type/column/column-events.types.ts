/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnGroupPreview from "../column-group/preview";
import ColumnLinePreview from "../column-line/preview";
import ColumnPreview from "./preview";

/**
 * @api
 */
export interface BindResizeHandleEventParamsInterface {
    column: ContentTypeCollectionInterface<ColumnPreview>;
    handle: JQuery;
    columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>;
    columnLine: ContentTypeCollectionInterface<ColumnLinePreview>;
}

/**
 * @api
 */
export interface InitElementEventParamsInterface {
    column: ContentTypeCollectionInterface<ColumnPreview>;
    element: JQuery;
    columnGroup: ContentTypeCollectionInterface<ColumnGroupPreview>;
    columnLine: ContentTypeCollectionInterface<ColumnLinePreview>;
}
