/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import {DataObject} from "../../data-store";
import WysiwygFactory from "../../wysiwyg/factory";
import WysiwygInterface from "../../wysiwyg/wysiwyg-interface";
import BasePreview from "../preview";
import Uploader from "../../uploader";

/**
 * @api
 */
export default class Preview extends BasePreview {

    /**
     * Wysiwyg instance
     */
    private wysiwyg: WysiwygInterface;

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * The textarea element in disabled mode
     */
    private textarea: HTMLTextAreaElement;
    /**
     * Uploader instance
     */
    private uploader: Uploader;

    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    public getUploader() {
        return this.uploader;
    }

    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     */
    public activateEditor(preview: Preview, event: JQueryEventObject) {
        const element = this.element || this.textarea;

        if (event.currentTarget !== event.target &&
            event.target !== element &&
            !element.contains(event.target)
        ) {
            return;
        }

        element.focus();
    }

    /**
     * Stop event to prevent execution of action when editing textarea.
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    public stopEvent(preview: Preview, event: JQueryEventObject) {
        event.stopPropagation();

        return true;
    }

    /**
     * Set state based on overlay mouseover event for the preview
     */
    public onMouseOverWrapper() {
        if (this.data.main.attributes()["data-show-overlay"] === "hover") {
            this.data.overlay.attributes(
                Object.assign(
                    this.data.overlay.attributes(),
                    {"data-background-color-orig": this.data.overlay.style().backgroundColor},
                ),
            );
            this.data.overlay.style(
                Object.assign(
                    this.data.overlay.style(),
                    {backgroundColor: this.data.overlay.attributes()["data-overlay-color"]},
                ),
            );
        }
        if (this.data.main.attributes()["data-show-button"] === "hover") {
            this.data.button.style(
                Object.assign(
                    this.data.button.style(),
                    {opacity: 1, visibility: "visible"},
                ),
            );
        }
    }

    /**
     * Set state based on overlay mouseout event for the preview
     */
    public onMouseOutWrapper() {
        if (this.data.main.attributes()["data-show-overlay"] === "hover") {
            this.data.overlay.style(
                Object.assign(
                    this.data.overlay.style(),
                    {backgroundColor: this.data.overlay.attributes()["data-background-color-orig"]},
                ),
            );
        }
        if (this.data.main.attributes()["data-show-button"] === "hover") {
            this.data.button.style(
                Object.assign(
                    this.data.button.style(),
                    {opacity: 0, visibility: "hidden"},
                ),
            );
        }
    }

    /**
     * @returns {Boolean}
     */
    public isWysiwygSupported(): boolean {
        return Config.getConfig("can_use_inline_editing_on_stage");
    }

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        this.element = element;

        element.id = this.parent.id + "-editor";

        const config = this.config.additional_data.wysiwygConfig.wysiwygConfigData;
        config.adapter.settings.fixed_toolbar_container = "#" + this.parent.id + " .pagebuilder-banner-text-content";

        WysiwygFactory(
            this.parent.id,
            element.id,
            this.config.name,
            config,
            this.parent.dataStore,
            "message",
        ).then((wysiwyg: WysiwygInterface): void => {
            this.wysiwyg = wysiwyg;
        });
    }

    /**
     * @param {HTMLTextAreaElement} element
     */
    public initTextarea(element: HTMLTextAreaElement)
    {
        this.textarea = element;

        // set initial value of textarea based on data store
        this.textarea.value = this.parent.dataStore.get("message") as string;
        this.adjustTextareaHeightBasedOnScrollHeight();

        // Update content in our stage preview textarea after its slideout counterpart gets updated
        events.on(`form:${this.parent.id}:saveAfter`, () => {
            this.textarea.value = this.parent.dataStore.get("message") as string;
            this.adjustTextareaHeightBasedOnScrollHeight();
        });
    }

    /**
     * Save current value of textarea in data store
     */
    public onTextareaKeyUp()
    {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.parent.dataStore.update(this.textarea.value, "message");
    }

    /**
     * Start stage interaction on textarea blur
     */
    public onTextareaFocus()
    {
        $(this.textarea).closest(".pagebuilder-banner-text-content").addClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStart");
    }

    /**
     * Stop stage interaction on textarea blur
     */
    public onTextareaBlur()
    {
        $(this.textarea).closest(".pagebuilder-banner-text-content").removeClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStop");
    }

    /**
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`${this.config.name}:${this.parent.id}:updateAfter`, () => {
            const dataStore = this.parent.dataStore.get() as DataObject;
            const imageObject = dataStore[this.config.additional_data.uploaderConfig.dataScope][0] || {};
            events.trigger(`image:${this.parent.id}:assignAfter`, imageObject);
        });

        events.on(`${this.config.name}:mountAfter`, () => {
            const dataStore = this.parent.dataStore.get() as DataObject;
            const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

            // Create uploader
            this.uploader = new Uploader(
                "imageuploader_" + this.parent.id,
                this.config.additional_data.uploaderConfig,
                this.parent.id,
                this.parent.dataStore,
                (initialImageValue as object[]),
            );
        });
    }

    /**
     * Adjust textarea's height based on scrollHeight
     */
    private adjustTextareaHeightBasedOnScrollHeight()
    {
        this.textarea.style.height = "";
        const scrollHeight = this.textarea.scrollHeight;
        const minHeight = parseInt($(this.textarea).css("min-height"), 10);

        if (scrollHeight === minHeight) { // leave height at 'auto'
            return;
        }

        $(this.textarea).height(scrollHeight);
    }
}
