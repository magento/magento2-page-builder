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
import {AdditionalDataConfigInterface} from "../content-type-config";
import DataStore from "../data-store";
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
     * Id of the stage
     */
    public stageId: string;

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
     * @param {String} stageId The ID in the registry of the stage containing the content type.
     */
    constructor(
        contentTypeId: string,
        elementId: string,
        config: AdditionalDataConfigInterface,
        dataStore: DataStore,
        fieldName: string,
        stageId: string,
    ) {
        this.contentTypeId = contentTypeId;
        this.elementId = elementId;
        this.fieldName = fieldName;
        this.config = config;
        this.dataStore = dataStore;
        this.stageId = stageId;

        if (this.config.adapter_config.mode === "inline") {
            /**
             * Don't include content_css within the inline mode of TinyMCE, if any stylesheets are included here they're
             * appended to the head of the main page, and thus cause other styles to be modified.
             *
             * The styles for typography in the inline editor are scoped within _typography.less
             */
            this.config.adapter.tinymce4.content_css = [];
        }

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

        // Clear padding on stage after fullscreen mode is toggled
        events.on(`stage:${this.stageId}:fullScreenModeChangeAfter`, this.revertFullScreenPadding.bind(this));
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
        this.clearSelection();

        this.getFixedToolbarContainer()
            .addClass("pagebuilder-toolbar-active");

        events.trigger("stage:interactionStart");

        // Wait for everything else to finish
        _.defer(() => {
            this.getFixedToolbarContainer()
                .find(".mce-tinymce-inline")
                .css("min-width", this.config.adapter_config.minToolbarWidth + "px");

            _.delay(this.adjustFullScreenPaddingToAccommodateInlineToolbar.bind(this), 200);
        });
    }

    /**
     * Called for the onBlur events
     */
    private onBlur() {
        this.clearSelection();

        this.getFixedToolbarContainer()
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

    /**
     * Clear any selections in the editable area
     */
    private clearSelection(): void {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        }
    }

    /**
     * Adjust padding on stage if in fullscreen mode to accommodate inline wysiwyg toolbar overflowing fixed viewport
     */
    private adjustFullScreenPaddingToAccommodateInlineToolbar() {
        if (this.config.adapter_config.mode !== "inline") {
            return;
        }

        const $stage = $(`#${this.stageId}`);
        const $fullScreenStageWrapper = $stage.closest(".stage-full-screen");
        const isInFullScreenMode = !!$fullScreenStageWrapper.length;

        if (!isInFullScreenMode) {
            return;
        }

        _.delay(() => {
            const $inlineToolbar = this.getFixedToolbarContainer().find(".mce-tinymce-inline");

            if (!$inlineToolbar.length) {
                return;
            }

            const inlineToolbarClientRectTop = $inlineToolbar.get(0).getBoundingClientRect().top;

            if (inlineToolbarClientRectTop >= 0) { // inline toolbar not out of bounds; continue
                return;
            }

            const paddingTopToApplyToStage = Math.abs(inlineToolbarClientRectTop);

            // increase padding top and adjust scrollTop accordingly to make it seamless
            $stage.css("paddingTop", paddingTopToApplyToStage);
            $fullScreenStageWrapper.scrollTop($fullScreenStageWrapper.scrollTop() + paddingTopToApplyToStage);
        }, 200);
    }

    /**
     * Revert padding previously applied for accommodating inline wysiwyg toolbar overflowing fixed viewport
     * in fullscreen mode
     */
    private revertFullScreenPadding() {
        $(`#${this.stageId}`).css("paddingTop", "");
    }

    /**
     * Get fixed toolbar container element referenced as selector in wysiwyg adapter settings
     *
     * @returns {jQuery}
     */
    private getFixedToolbarContainer() {
        return $(`#${this.elementId}`).closest(`${this.config.adapter.settings.fixed_toolbar_container}`);
    }
}
