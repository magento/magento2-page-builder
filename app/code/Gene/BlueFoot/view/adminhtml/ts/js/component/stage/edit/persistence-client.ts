import {ModalComponent} from "../edit";
import DataStore from "../../data-store";

/**
 * PersistenceClient
 *
 * Acts as the data provider client between our system and the UI component system
 */
export default class PersistenceClient {
    modal: ModalComponent;
    store: DataStore;
    id: string;

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
    save(data: any, options: any): void {
        this.store.update(this.id, data);
        this.modal.closeModal();
    }
}
