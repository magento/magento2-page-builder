/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import registry from "uiRegistry";
import DataStore from "../data-store";
import PersistenceClient from "./edit/persistence-client";
import Structural from "./structural/abstract";

export interface FormComponent {
    destroy(): void;
}
export interface ModalComponent {
    setTitle(title: string): void;
    openModal(): void;
    closeModal(): void;
}
export interface InsertFormComponent {
    destroyInserted(): void;
    removeActions(): void;
    onRender(data: string): void;
}

export default class Edit {
    private modal: ModalComponent = registry.get("pagebuilder_modal_form.pagebuilder_modal_form.modal");
    private insertForm: InsertFormComponent =
        registry.get("pagebuilder_modal_form.pagebuilder_modal_form.modal.insert_form");
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
    }

    /**
     * Open the modal
     */
    public open(): void {
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
    public getFormComponent(): string {
        return registry.get("component_" + this.instance.config.form);
    }

    /**
     * Render the form
     */
    public render(): void {
        // Pass the UI component to the render function
        this.insertForm.onRender(this.getFormComponent());
        this.setDataProviderClient();
    }

    /**
     * Set the title on the modal
     */
    public setTitle(): void {
        this.modal.setTitle($t("Edit " + this.instance.config.label));
    }

    /**
     * Set the data provider client to be the current instance
     */
    public setDataProviderClient(): void {
        const formName = this.instance.config.form;

        // Destroy the last data provider so a new instance is created
        if (registry.get("_pagebuilder_last_provider")) {
            registry.remove(registry.get("_pagebuilder_last_provider"));
        }

        // Set the current edited instances data into the registry
        registry.set("_pagebuilder_edit_data", this.store.get(this.instance.id));

        // Retrieve the component
        registry.get(formName + "." + formName, (component: any) => {
            const provider = registry.get(component.provider);
            registry.set("_pagebuilder_last_provider", component.provider);

            // Set the data provider client to our persistence client
            provider.client = new PersistenceClient(this.modal, this.store, this.instance.id);
        });
    }

    /**
     * Retrieve the form component
     *
     * @returns {any}
     */
    public getFormComponentInstance(): FormComponent {
        const formName = this.instance.config.form;
        return registry.get(formName + "." + formName);
    }

    /**
     * Destroy the inserted component
     */
    public destroyInserted(): void {
        const existingComponent = this.getFormComponentInstance();
        if (existingComponent) {
            existingComponent.destroy();
        }

        // Reset the insert form component
        this.insertForm.destroyInserted();
        this.insertForm.removeActions();
    }
}
