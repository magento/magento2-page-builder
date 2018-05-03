/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import ContentTypeInterface from "../../content-type";
import DataStore from "../../data-store";

export default class Edit {
    private instance: ContentTypeInterface;
    private store: DataStore;

    /**
     * @param {ContentTypeInterface} instance
     * @param {DataStore} store
     */
    constructor(instance: ContentTypeInterface, store: DataStore) {
        this.instance = instance;
        this.store = store;
        events.on("form:save:" + this.instance.id, (data: any) => {
            this.store.update(this.instance.id, data);
        });
    }

    /**
     * Open the modal
     */
    public open(): void {
        const contentTypeData = this.store.get(this.instance.id);
        let formNamespace = this.instance.config.form;

        // Use the default form unless a custom one is defined
        if (undefined !== this.instance.config.appearances[contentTypeData.appearance].form) {
            formNamespace = this.instance.config.appearances[contentTypeData.appearance].form;
        }

        events.trigger("form:render", {
            data: contentTypeData,
            appearances: this.instance.config.appearances,
            defaultNamespace: this.instance.config.form,
            id: this.instance.id,
            namespace: formNamespace,
            title: this.instance.config.label,
        });
    }
}
