/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import utils from "mageUtils";
import _ from "underscore";
import Config from "../config";
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
            const viewport = Config.getConfig("viewport");
            const defaultViewport = Config.getConfig("defaultViewport");
            // set value to dataStore from default viewport if it is empty
            if (defaultViewport !== viewport) {
                _.each(this.instance.getViewportFields(viewport, data), (value, key) => {
                    const isEmpty = !_.find(
                        utils.compare(data[key], this.instance.dataStores[defaultViewport].get(key)).changes,
                        (change) => !_.isEmpty(change.oldValue),
                    );
                    if (isEmpty) {
                        this.instance.dataStores[viewport].set(key, data[key]);
                        data[key] = this.instance.dataStores[defaultViewport].get(key);
                    }
                });

            }
            this.dataStore.setState(this.filterData(data));
        });
    }

    /**
     * Open the modal
     */
    public open(): void {
        const contentTypeData = this.dataStore.getState();
        const viewport = Config.getConfig("viewport");
        const defaultViewport = Config.getConfig("defaultViewport");
        // set empty value if it the same in default viewport
        if (defaultViewport !== viewport) {
            _.each(this.instance.getViewportFields(viewport, contentTypeData), (value, key) => {
                if (utils.compare(contentTypeData[key], this.instance.dataStores.desktop.get(key)).equal) {
                    contentTypeData[key] = undefined;
                }
            });
        }
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
