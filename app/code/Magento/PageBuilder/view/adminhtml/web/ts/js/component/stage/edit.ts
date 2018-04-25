/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import ContentTypeInterface from "../../content-type";
import DataStore from "../data-store";

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
        events.trigger("form:render", {
            data: this.store.get(this.instance.id),
            id: this.instance.id,
            namespace: this.instance.config.form,
            title: this.instance.config.label,
        });
    }
}
