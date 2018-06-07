/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeConfigInterface from "./content-type-config.d";
import Preview from "./content-type/preview";
import Master from "./content-type/master";
import DataStore from "./data-store";

export default interface ContentTypeInterface {
    id: string;
    stageId: string;
    parent: ContentTypeInterface;
    config: ContentTypeConfigInterface;
    preview: Preview;
    master: Master;
    dataStore: DataStore;
}
