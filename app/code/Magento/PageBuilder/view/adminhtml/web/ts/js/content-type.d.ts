/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "./content-type-collection.d";
import ContentTypeConfigInterface from "./content-type-config.d";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore from "./data-store";

export default interface ContentTypeInterface<P = Preview, M = Master> {
    id: string;
    stageId: string;
    parent: ContentTypeCollectionInterface;
    config: ContentTypeConfigInterface;
    preview: P;
    content: M;
    dataStore: DataStore;
}
