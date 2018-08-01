/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import wysiwygEvents from "mage/adminhtml/wysiwyg/events";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import WysiwygInstanceInterface from "wysiwygAdapter";
import {AdditionalDataConfigInterface} from "../content-type-config";
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
     * @param {String} contentTypeId
     * @param {String} elementId
     * @param {AdditionalDataConfigInterface} config
     * @param {DataStore} dataStore
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
    ) {
        this.contentTypeId = contentTypeId;
        // todo refactor here
        this.fieldName = config.additional.fieldName;
        this.dataStore = dataStore;

        config = this.encapsulateConfigBasedOnContentType(config);

        this.wysiwygAdapter = WysiwygFactory(elementId, config);

        const $element = $("#" + elementId);
        const minToolbarWidth = config.additional.minToolbarWidth;

        // prevent interactability with options when in editing mode
        this.onFocus(() => {
            window.getSelection().empty();

            $(`#${elementId}`).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

            // If there isn't enough room for a left-aligned toolbar, right align it
            if ($(window).width() < $element.offset().left + parseInt(minToolbarWidth)) {
                $element.addClass("_right-aligned-toolbar");
            }
            else {
                $element.removeClass("_right-aligned-toolbar");
            }

            events.trigger("stage:interactionStart");

            // Wait for everything else to finish
            _.defer(() => {
                $(config.adapter.settings.fixed_toolbar_container + " .mce-tinymce-inline")
                    .css("min-width", minToolbarWidth + "px");
            });
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
     * @returns {WysiwygInstanceInterface}
     */
    public getAdapter() {
        return this.wysiwygAdapter;
    }

    /**
     * @param {Function} callback
     */
    public onEdit(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            wysiwygEvents.afterChangeContent,
            _.debounce(callback, 100),
        );
    }

    /**
     * @param {Function} callback
     */
    public onFocus(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            wysiwygEvents.afterFocus,
            callback,
        );
    }

    /**
     * @param {Function} callback
     */
    public onBlur(callback: () => void) {
        this.wysiwygAdapter.eventBus.attachEventHandler(
            wysiwygEvents.afterBlur,
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
     * @param {AdditionalDataConfigInterface} config
     * @returns {AdditionalDataConfigInterface} - interpolated configuration
     */
    private encapsulateConfigBasedOnContentType(config: object)
    {
        const clonedConfig = $.extend(true, {}, config);

        if (!clonedConfig.additional.encapsulateSelectorConfigKeys) {
            return clonedConfig;
        }

        _.each(clonedConfig.additional.encapsulateSelectorConfigKeys, (isEnabled, configKey) => {
            const configValue = clonedConfig.adapter.settings[configKey];

            if (!isEnabled) {
                return;
            }

            clonedConfig.adapter.settings[configKey] = (
                "#" + this.contentTypeId + (configValue ? " " + configValue : "")
            );
        });

        return clonedConfig;
    }
}
