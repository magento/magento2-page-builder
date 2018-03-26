/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import DataStore from "../data-store";
import Structural from "./structural/abstract";

export default class Edit {
    private instance: Structural;
    private store: DataStore;

    /**
     * Initiate the edit class with an instance of structural
     *
     * @param {Structural} instance
     * @param {DataStore} store
     */
    constructor(instance: Structural, store: DataStore) {
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
