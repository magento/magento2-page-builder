/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Structural from "./structural/abstract";
import registry from "uiRegistry";
import DataStore from "../data-store";
import $t from "mage/translate";

interface FormComponent {
    destroy(): void;
}
interface ModalComponent {
    setTitle(title: string): void;
    openModal(): void;
    closeModal(): void;
}
interface InsertFormComponent {
    destroyInserted(): void;
    removeActions(): void;
    onRender(data: string): void;
}

export default class Edit {
    modal: ModalComponent = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal');
    insertForm: InsertFormComponent = registry.get('bluefoot_modal_form.bluefoot_modal_form.modal.insert_form');
    instance: Structural;
    store: DataStore;

    /**
     * Initiate the edit class with an instance of structural
     *
     * @param {Structural} instance
     * @param {DataStore} store
     */
    constructor(instance: Structural, store: DataStore) {
        this.instance = instance;
        this.store = store;
    }

    /**
     * Open the modal
     */
    open(): void {
        this.destroyInserted();
        this.setTitle();
        this.render();
        this.modal.openModal();
    }

    /**
     * Retrieve the content types form component text from the registry
     *
     * @returns {string}
     */
    getFormComponent(): string {
        return registry.get('component_' + this.instance.config.form);
    }

    /**
     * Render the form
     */
    render(): void {
        // Pass the UI component to the render function
        this.insertForm.onRender(this.getFormComponent());
        this.setDataProviderClient();
    }

    /**
     * Save any data which has been modified in the edit panel
     *
     * @param data
     * @param options
     */
    save(data: any, options: any): void {
        this.store.update(this.instance.id, data);
        this.modal.closeModal();
    }

    /**
     * Set the title on the modal
     */
    setTitle(): void {
        this.modal.setTitle($t('Edit ' + (this.instance.config.label || $t('Block'))));
    }

    /**
     * Set the data provider client to be the current instance
     */
    setDataProviderClient(): void {
        let formName = this.instance.config.form;
        // Retrieve the component
        registry.get(formName + '.' + formName, (component: any) => {
            const provider = registry.get(component.provider);

            // Set the instance to act as it's client in the data provider
            provider.client = this;

            // Set the data on the provider from the data store
            provider.set('data', this.store.get(this.instance.id));
        });
    }

    /**
     * Retrieve the form component
     *
     * @returns {any}
     */
    getFormComponentInstance(): FormComponent {
        let formName = this.instance.config.form;
        return registry.get(formName + '.' + formName);
    }

    /**
     * Destroy the inserted component
     */
    destroyInserted(): void {
        let existingComponent = this.getFormComponentInstance();
        if (existingComponent) {
            existingComponent.destroy();
        }

        // Reset the insert form component
        this.insertForm.destroyInserted();
        this.insertForm.removeActions();
    }
}
