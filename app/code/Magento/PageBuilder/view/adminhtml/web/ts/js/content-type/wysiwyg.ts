/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import DataStore from "../data-store";

/**
 * @api
 */
export default class Wysiwyg {
    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygSetup;

    /**
     * Content type's data store
     */
    private dataStore: DataStore;

    /**
     * Key in data store reflecting value held in wysiwyg
     */
    private dataStoreKey: string;

    /**
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {Object} config
     * @param {String} mode
     * @param {DataStore} dataStore
     * @param {String} dataStoreKey
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: object,
        mode: string,
        dataStore: DataStore,
        dataStoreKey: string,
    ) {
        this.wysiwygAdapter = new WysiwygSetup(elementId, config);
        this.dataStore = dataStore;
        this.dataStoreKey = dataStoreKey;

        if (mode) {
            this.wysiwygAdapter.setup(mode);
        }

        if (mode === "inline") {
            // prevent interactability with options when in inline editing mode
            this.onFocused(() => {
                $(`#${elementId}`).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");
                events.trigger("stage:interactionStart");
            });

            // resume normal interactability with opens when leaving inline editing mode
            this.onBlurred(() => {
                window.getSelection().empty();
                $(`#${elementId}`).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
                events.trigger("stage:interactionStop");
            });
        }

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.onEdited(this.saveContentFromWysiwygToDataStore.bind(this));

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${contentTypeId}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));
    }

    /**
     * @returns {WysiwygSetup}
     */
    public getAdapter() {
        return this.wysiwygAdapter;
    }

    /**
     * @param {Function} callback
     */
    public onEdited(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            _.debounce(callback, 100),
        );
    }

    /**
     * @param {Function} callback
     */
    public onFocused(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onBlurred(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            callback,
        );
    }

    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    private saveContentFromWysiwygToDataStore() {
        this.dataStore.update(
            this.getAdapter().getContent(),
            this.dataStoreKey,
        );
    }

    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */
    private setContentFromDataStoreToWysiwyg() {
        this.getAdapter().setContent(
            this.dataStore.get(this.dataStoreKey) as string,
        );
    }
}
