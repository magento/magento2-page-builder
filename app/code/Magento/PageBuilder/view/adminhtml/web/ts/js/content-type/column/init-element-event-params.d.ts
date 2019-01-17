/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../../content-type-collection.types";
import ColumnGroupPreview from "../column-group/preview";
import ColumnPreview from "./preview";

export default interface InitElementEventParamsInterface {
    column: ContentTypeCollectionInterface<ColumnPreview>;
    element: JQuery;
    parent: ContentTypeCollectionInterface<ColumnGroupPreview>;
}
