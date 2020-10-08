/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import ContentTypeInterface from "../content-type.types";
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
        events.on("form:" + this.instance.id + ":saveAfter", (data: DataObject) => {
            this.dataStore.setState(this.filterData(data));
        });
    }

    /**
     * Open the modal
     */
    public open(): void {
        const contentTypeData = this.dataStore.getState();
        events.trigger("contentType:editBefore", { contentType: this.instance } );
        events.trigger("form:renderAfter", {
            data: contentTypeData,
            appearances: this.instance.config.appearances,
            defaultNamespace: this.getDefaultNamespaceForm(),
            id: this.instance.id,
            namespace: this.getFormNamespace(contentTypeData),
            title: this.instance.config.label,
        });
    }

    /**
     * Flip flop to JSON and back again to ensure all data received from the form is serializable. Magento by default
     * adds functions into some basic types which cannot be serialized when calling PostMessage.
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    private filterData(data: DataObject): DataObject {
        return JSON.parse(JSON.stringify(data));
    }

    /**
     * Determine the form namespace based on the currently set appearance
     *
     * @param {DataObject} contentTypeData
     * @returns {string}
     */
    private getFormNamespace(contentTypeData: DataObject): string {
        const viewport = this.instance.preview.viewport();
        const currentAppearance = this.dataStore.get<string>("appearance");
        const appearance = this.instance.config.appearances[currentAppearance];
        const breakpoints = appearance.breakpoints;
        let formNamespace = this.getDefaultNamespaceForm();

        // Use the default form unless a custom one is defined
        if (breakpoints && breakpoints[viewport] && breakpoints[viewport].form) {
            formNamespace = breakpoints[viewport].form;
        } else if (!_.isUndefined(appearance.form)) {
            formNamespace = appearance.form;
        }

        return formNamespace;
    }

    /**
     * Determine the form default namespace based on the currently set appearance and breakpoint
     *
     * @returns {string}
     */
    private getDefaultNamespaceForm(): string {
        const viewport = this.instance.preview.viewport();
        const breakpoints = this.instance.config.breakpoints;
        let formNamespace = this.instance.config.form;

        if (breakpoints && breakpoints[viewport] && breakpoints[viewport].form) {
            formNamespace = breakpoints[viewport].form;
        }

        return formNamespace;
    }
}
