/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.d";
import ColumnGroupPreview from "../column-group/preview";
import ColumnPreview from "./preview";

export default interface ColumnBindResizeHandleEventParamsInterface {
    column: ContentTypeCollectionInterface<ColumnPreview>;
    handle: JQuery;
    parent: ContentTypeCollectionInterface<ColumnGroupPreview>;
}
