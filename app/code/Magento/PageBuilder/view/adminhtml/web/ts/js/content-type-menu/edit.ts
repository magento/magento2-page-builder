/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import ContentTypeInterface from "../content-type";
import DataStore, {DataObject} from "../data-store";

export default class Edit {
    private instance: ContentTypeInterface;
    private dataStore: DataStore;

    /**
     * @param {ContentTypeInterface} instance
     * @param {DataStore} dataStore
     */
    constructor(instance: ContentTypeInterface, dataStore: DataStore) {
        this.instance = instance;
        this.dataStore = dataStore;
        events.on("form:" + this.instance.id + ":saveAfter", (data: any) => {
            this.dataStore.update(data);
        });
    }

    /**
     * Open the modal
     */
    public open(): void {
        const contentTypeData = this.dataStore.get() as DataObject;
        let formNamespace = this.instance.config.form;

        // Use the default form unless a custom one is defined
        if (undefined !== this.instance.config.appearances[contentTypeData.appearance as string].form) {
            formNamespace = this.instance.config.appearances[contentTypeData.appearance as string].form;
        }

        events.trigger("form:renderAfter", {
            data: contentTypeData,
            appearances: this.instance.config.appearances,
            defaultNamespace: this.instance.config.form,
            id: this.instance.id,
            namespace: formNamespace,
            title: this.instance.config.label,
        });
    }
}
