/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import WysiwygSetup from "mage/adminhtml/wysiwyg/tiny_mce/setup";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import DataStore from "../data-store";
import WysiwygFactory from "./wysiwyg-factory";

/**
 * Inline editing wysiwyg component
 *
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
     * Element id
     */
    private elementId: string;

    /**
     * Element
     */
    private element: JQuery;

    /**
     * String
     */
    private maxToolbarWidth: number;

    /**
     *
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {Object} config
     * @param {DataStore} dataStore
     * @param {() => void} onFocusCallback
     * @param {() => void} onBlurCallback
     * @param {() => void} onEditCallback
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: object,
        dataStore: DataStore,
        onFocusCallback: () => void = null,
        onBlurCallback: () => void = null,
        onEditCallback: () => void = null

    ) {
        this.contentTypeId = contentTypeId;
        // todo refactor here
        this.fieldName = config.additional.fieldName;
        this.dataStore = dataStore;

        config = this.encapsulateConfigBasedOnContentType(config);

        this.wysiwygAdapter = WysiwygFactory(elementId, config);

        this.element = $("#" + elementId);
        this.elementId = elementId;
        this.maxToolbarWidth = 360;

        // prevent interactability with options when in editing mode
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceFocus",
            onFocusCallback ? onFocusCallback : this.onFocus.bind(this),
        );

        // resume normal interactability with opens when leaving editing mode
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceBlur",
            onBlurCallback ? onBlurCallback : this.onBlur.bind(this),
        );

        // Update content in our data store after our stage preview wysiwyg gets updated
        this.wysiwygAdapter.eventBus.attachEventHandler(
            "tinymceChange",
            _.debounce(onEditCallback ? onEditCallback : this.saveContentFromWysiwygToDataStore.bind(this), 100),
        );

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
    public onFocus(callback: () => void)
    {
        $(`#${this.elementId}`).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

        // If there isn't enough room for a left-aligned toolbar, right align it
        if ($(window).width() < this.element.offset().left + this.maxToolbarWidth) {
            this.element.addClass('_right-aligned-toolbar');
        }
        else {
            this.element.removeClass('_right-aligned-toolbar')
        }

        events.trigger("stage:interactionStart");
    }

    /**
     * @param {Function} callback
     */
    public onBlur(callback: () => void)
    {
        window.getSelection().empty();
        $(`#${this.elementId}`).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
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

    /**
     * Prepend specific config with id to encapsulate its targeting by the vendor wysiwyg editor
     *
     * @param {object} config
     * @returns {object} - interpolated configuration
     * //todo move in the separate function
     */
    private encapsulateConfigBasedOnContentType(config: object)
    {
        const clonedConfig = Object.assign( {}, config);

        if (!clonedConfig["additional"].encapsulateSelectorConfigKeys) {
            return clonedConfig;
        }

        _.each(clonedConfig["additional"].encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
            const configValue = clonedConfig["adapter"].settings[configKey];

            if (!isEnabled) {
                return;
            }

            clonedConfig['adapter'].settings[configKey] = (
                "#" + this.contentTypeId + (configValue ? " " + configValue : "")
            );
        });

        return clonedConfig;
    }
}
