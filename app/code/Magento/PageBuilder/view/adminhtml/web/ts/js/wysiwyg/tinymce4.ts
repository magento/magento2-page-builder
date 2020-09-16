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
import {AdditionalDataConfigInterface} from "../content-type-config.types";
import DataStore from "../data-store";
import checkStageFullScreen from "../utils/check-stage-full-screen";
import pageBuilderHeaderHeight from "../utils/pagebuilder-header-height";
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
     * Create a debounce to save the content into the data store
     */
    private saveContentDebounce = _.debounce(
        this.saveContentFromWysiwygToDataStore.bind(this),
        500,
    );

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
            this.onChangeContent.bind(this),
        );

        // Update content in our stage preview wysiwyg after its slideout counterpart gets updated
        events.on(`form:${this.contentTypeId}:saveAfter`, this.setContentFromDataStoreToWysiwyg.bind(this));

        events.on(`stage:${this.stageId}:fullScreenModeChangeAfter`, this.toggleFullScreen.bind(this));
    }

    /**
     * Hide TinyMce inline toolbar options after fullscreen exit
     */
    public toggleFullScreen()
    {
        const $editor = $(`#${this.elementId}`);
        // wait for fullscreen to close
        _.defer(() => {
            if (!checkStageFullScreen(this.stageId) &&
                this.config.adapter_config.mode === "inline" &&
                $editor.hasClass("mce-edit-focus")
            ) {
                $editor.removeClass("mce-edit-focus");
                this.onBlur();
            }
        });
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
        this.getFixedToolbarContainer()
            .addClass("pagebuilder-toolbar-active");

        events.trigger("stage:interactionStart");

        // Wait for everything else to finish
        _.defer(() => {
            this.getFixedToolbarContainer()
                .find(".mce-tinymce-inline")
                .css("min-width", this.config.adapter_config.minToolbarWidth + "px");

            this.invertInlineEditorToAccommodateOffscreenToolbar();
        });
    }

    /**
     * Called for the onChangeContent event
     */
    private onChangeContent() {
        this.saveContentDebounce();
        this.invertInlineEditorToAccommodateOffscreenToolbar();
    }

    /**
     * Called for the onBlur events
     */
    private onBlur() {
        this.getFixedToolbarContainer()
            .removeClass("pagebuilder-toolbar-active")
            .find(".mce-tinymce-inline")
            .css("transform", "");

        events.trigger("stage:interactionStop");
    }

    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */
    private saveContentFromWysiwygToDataStore() {
        this.dataStore.set(
            this.fieldName,
            this.getAdapter().getContent(),
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
     * Adjust padding on stage if in fullscreen mode to accommodate inline wysiwyg toolbar overflowing fixed viewport
     */
    private invertInlineEditorToAccommodateOffscreenToolbar() {
        if (this.config.adapter_config.mode !== "inline") {
            return;
        }

        const $inlineToolbar = this.getFixedToolbarContainer().find(".mce-tinymce-inline");

        if (!$inlineToolbar.length) {
            return;
        }

        const inlineWysiwygClientRectTop = this.getFixedToolbarContainer().get(0).getBoundingClientRect().top
                                         - pageBuilderHeaderHeight(this.stageId);

        if (!checkStageFullScreen(this.stageId) || $inlineToolbar.height() < inlineWysiwygClientRectTop) {
            $inlineToolbar.css("transform", "translateY(-100%)");
            return;
        }
        $inlineToolbar.css("transform", "translateY(" + this.getFixedToolbarContainer().height() + "px)");
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
