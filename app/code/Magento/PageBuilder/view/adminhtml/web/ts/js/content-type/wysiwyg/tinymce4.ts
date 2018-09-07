/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygEvents from "mage/adminhtml/wysiwyg/events";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import WysiwygInstanceInterface from "wysiwygAdapter";
import {AdditionalDataConfigInterface} from "../../content-type-config";
import DataStore from "../../data-store";
import WysiwygInterface from "./wysiwyg-interface";

/**
 * Inline editing wysiwyg component
 *
 * @api
 */
export default class Wysiwyg implements WysiwygInterface {
    /**
     * The id of the editor element
     */
    public elementId: string;

    /**
     * The supplied wysiwyg configuration
     */
    public config: AdditionalDataConfigInterface;

    /**
     * Id of content type
     */
    public contentTypeId: string;

    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygInstanceInterface;

    /**
     * Content type's data store
     */
    private dataStore: DataStore;

    /**
     * Field name in data store reflecting value held in wysiwyg
     */
    private fieldName: string;

    /**
     * @param {String} contentTypeId The ID in the registry of the content type.
     * @param {String} elementId The ID of the editor element in the DOM.
     * @param {AdditionalDataConfigInterface} config The configuration for the wysiwyg.
     * @param {DataStore} dataStore The datastore to store the content in.
     * @param {String} fieldName The key in the provided datastore to set the data.
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
        fieldName: string,
    ) {
        this.contentTypeId = contentTypeId;
        this.elementId = elementId;
        this.fieldName = fieldName;
        this.config = config;
        this.dataStore = dataStore;

        const wysiwygSetup = new WysiwygSetup(this.elementId, this.config.adapter);

        wysiwygSetup.setup(this.config.adapter_config.mode);

        this.wysiwygAdapter = wysiwygSetup.wysiwygInstance;

        if (this.config.adapter_config.mode === "inline") {
            this.wysiwygAdapter.eventBus.attachEventHandler(
                WysiwygEvents.afterFocus,
                this.onFocus.bind(this),
            );

            this.wysiwygAdapter.eventBus.attachEventHandler(
                WysiwygEvents.afterBlur,
                this.onBlur.bind(this),
            );
        }

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.wysiwygAdapter.eventBus.attachEventHandler(
            WysiwygEvents.afterChangeContent,
            _.debounce(this.saveContentFromWysiwygToDataStore.bind(this), 100),
        );

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${this.contentTypeId}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));
    }

    /**
     * @returns {WysiwygInstanceInterface}
     */
    public getAdapter() {
        return this.wysiwygAdapter;
    }

    /**
     * Called for the onFocus event
     */
    private onFocus() {
        // Clear any existing document selections
        window.getSelection().empty();

        $(`#${this.elementId}`)
            .closest(`${this.config.adapter.settings.fixed_toolbar_container}`)
            .addClass("pagebuilder-toolbar-active");

        events.trigger("stage:interactionStart");

        // Wait for everything else to finish
        _.defer(() => {
            $(this.config.adapter.settings.fixed_toolbar_container + " .mce-tinymce-inline")
                .css("min-width", this.config.adapter_config.minToolbarWidth + "px");
        });
    }

    /**
     * Called for the onBlur events
     */
    private onBlur() {
        // Clear any selections in the editable area
        window.getSelection().empty();
        $(`#${this.elementId}`)
            .closest(`${this.config.adapter.settings.fixed_toolbar_container}`)
            .removeClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStop");
    }

    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    private saveContentFromWysiwygToDataStore() {
        this.dataStore.update(
            this.getAdapter().getContent(),
            this.fieldName,
        );
    }

    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    private setContentFromDataStoreToWysiwyg() {
        this.getAdapter().setContent(
            this.dataStore.get(this.fieldName) as string,
        );
    }
}
