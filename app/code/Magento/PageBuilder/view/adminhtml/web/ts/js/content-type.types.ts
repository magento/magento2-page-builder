/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "./content-type-collection.types";
import ContentTypeConfigInterface, {ConfigFieldInterface} from "./content-type-config.types";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore, {DataObject} from "./data-store";

export default interface ContentTypeInterface<P extends Preview = Preview, M extends Master = Master> {
    id: string;
    stageId: string;
    parentContentType?: ContentTypeCollectionInterface;
    config: ContentTypeConfigInterface;
    element: JQuery;
    dataStore: DataStore;
    dataStores: {[key: string]: DataStore};
    preview: P;
    content: M;
    dropped: boolean;

    /**
     * Destroys current instance
     */
    destroy(): void;

    /**
     * Get viewport fields.
     */
    getViewportFields(viewport: string, data: DataObject): ConfigFieldInterface;
    getDataStoresStates(): {[key: string]: any};
    setViewportDataToDataStore(viewport: string): void;
}
