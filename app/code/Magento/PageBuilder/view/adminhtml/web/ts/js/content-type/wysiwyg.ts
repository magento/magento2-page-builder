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
     * Id of content type
     */
    private contentTypeId: string;

    /**
     * Wysiwyg adapter instance
     */
    private wysiwygAdapter: WysiwygSetup;

    /**
     * Content type's data store
     */
    private dataStore: DataStore;

    /**
     * Field name in data store reflecting value held in wysiwyg
     */
    private fieldName: string;

    /**
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {Object} config
     * @param {DataStore} dataStore
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: object,
        dataStore: DataStore,
    ) {
        this.contentTypeId = contentTypeId;
        this.fieldName = config.fieldName;
        this.dataStore = dataStore;

        config = this.encapsulateConfigBasedOnContentType(config);
        const mode = config.mode;

        this.wysiwygAdapter = new WysiwygSetup(elementId, config.wysiwygConfigData);

        if (mode) {
            this.wysiwygAdapter.setup(mode);
        }

        // prevent interactability with options when in editing mode
        this.onFocus(() => {
            $(`#${elementId}`).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");
            events.trigger("stage:interactionStart");
        });

        // resume normal interactability with opens when leaving editing mode
        this.onBlur(() => {
            window.getSelection().empty();
            $(`#${elementId}`).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
            events.trigger("stage:interactionStop");
        });

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.onEdit(this.saveContentFromWysiwygToDataStore.bind(this));

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
    public onEdit(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            _.debounce(callback, 100),
        );
    }

    /**
     * @param {Function} callback
     */
    public onFocus(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onBlur(callback: () => void) {
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

    /**
     * Prepend specific config with id to encapsulate its targeting by the vendor wysiwyg editor
     *
     * @param {object} config
     * @returns {object} - interpolated configuration
     */
    private encapsulateConfigBasedOnContentType(config: object)
    {
        const clonedConfig = $.extend(true, {}, config);

        if (!clonedConfig.encapsulateSelectorConfigKeys) {
            return clonedConfig;
        }

        _.each(clonedConfig.encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
            const configValue = clonedConfig.wysiwygConfigData.settings[configKey];

            if (!isEnabled) {
                return;
            }

            clonedConfig.wysiwygConfigData.settings[configKey] = (
                "#" + this.contentTypeId + (configValue ? " " + configValue : "")
            );
        });

        return clonedConfig;
    }
}
