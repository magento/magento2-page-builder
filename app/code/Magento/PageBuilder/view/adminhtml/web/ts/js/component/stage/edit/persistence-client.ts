/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import DataStore from "../../data-store";
import {ModalComponent} from "../edit";

/**
 * Acts as the data provider client between our system and the UI component system
 */
export default class PersistenceClient {
    private modal: ModalComponent;
    private store: DataStore;
    private id: string;

    /**
     * @param {ModalComponent} modal
     * @param {DataStore} store
     * @param {string} id
     */
    constructor(modal: ModalComponent, store: DataStore, id: string) {
        this.modal = modal;
        this.store = store;
        this.id = id;
    }

    /**
     * Save any data which has been modified in the edit panel
     *
     * @param data
     * @param options
     */
    public save(data: any, options: any): void {
        this.store.update(this.id, data);
        this.modal.closeModal();
    }
}
