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
import delayUntil from "../utils/delay-until";
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
     * ResizeObserver to detect the toolbar height change
     */
    private resizeObserver: ResizeObserver;

    /**
     * Height of WYSIWYG toolbar
     */
    private toolbarHeight: number;

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
            this.config.adapter.tinymce.content_css = [];
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

        const element = document.querySelector(`#${this.elementId}`);
        if (!element) {
            return;
        }

        // Wait for everything else to finish
        _.defer(() => delayUntil(
            () => {
                const $inlineToolbar = this.getFixedToolbarContainer().find(".tox-tinymce-inline");
                const self = this;

                $inlineToolbar.css("min-width", this.config.adapter_config.minToolbarWidth + "px");

                this.invertInlineEditorToAccommodateOffscreenToolbar();

                // Update toolbar when the height changes
                this.toolbarHeight = $inlineToolbar.height();
                if ($inlineToolbar.length) {
                    this.resizeObserver = new ResizeObserver((entries) => {
                        for (const entry of entries) {
                            if (entry.target === $inlineToolbar.get(0)
                                && entry.target.clientHeight !== self.toolbarHeight
                            ) {
                                self.invertInlineEditorToAccommodateOffscreenToolbar();
                                self.toolbarHeight = entry.target.clientHeight;
                            }
                        }
                    });
                    this.resizeObserver.observe($inlineToolbar.get(0));
                }
                const dialogContainer = document.querySelector(`#${this.elementId} ~ .tox-tinymce-aux`);
                if (!!dialogContainer) {
                    dialogContainer.setAttribute("data-editor-aux", this.elementId);
                    document.body.appendChild(dialogContainer);
                }
            },
            () => element.classList.contains("mce-edit-focus"),
            10,
        ));
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
            .find(".tox-tinymce-inline")
            .css("top", "");

        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.getFixedToolbarContainer().find(".tox-tinymce-inline").get(0));
        }
        this.toolbarHeight = 0;

        const dialogContainer = document.querySelector(`[data-editor-aux=${this.elementId}]`);
        if (!!dialogContainer) {
            dialogContainer.removeAttribute("data-editor-aux");
            document.querySelector(`#${this.elementId}`).parentNode.appendChild(dialogContainer);
        }

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

        const $inlineToolbar = this.getFixedToolbarContainer().find(".tox-tinymce-inline");

        if (!$inlineToolbar.length) {
            return;
        }

        const inlineWysiwygClientRectTop = this.getFixedToolbarContainer().get(0).getBoundingClientRect().top
                                         - pageBuilderHeaderHeight(this.stageId);

        if (!checkStageFullScreen(this.stageId) || $inlineToolbar.height() < inlineWysiwygClientRectTop) {
            let extraHeight = 0;
            if ($inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-left']").length
                || $inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-right']").length
                || $inlineToolbar.parents(".pagebuilder-slide[data-appearance='collage-centered']").length
            ) {
                extraHeight = 29;
            }
            $inlineToolbar.css("top", ($inlineToolbar.height() - extraHeight) * -1);
            return;
        }
        $inlineToolbar.css("top", "");
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
