/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface from "./content-type-config.types";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore from "./data-store";

export default interface ContentTypeInterface<P extends Preview = Preview, M extends Master = Master> {
    id: string;
    stageId: string;
    parentContentType?: ContentTypeCollectionInterface;
    config: ContentTypeConfigInterface;
    element: JQuery;
    dataStore: DataStore;
    preview: P;
    content: M;
    dropped: boolean;
}
