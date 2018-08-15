/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import Config from "../../config";
import BasePreview from "../preview";
import WysiwygFactory from "../wysiwyg/factory";
import WysiwygInterface from "../wysiwyg/wysiwyg-interface";

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

        WysiwygFactory(
            this.parent.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.parent.dataStore,
            "content",
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
        this.textarea.value = this.parent.dataStore.get("content") as string;
        this.adjustTextareaHeightBasedOnScrollHeight();

        // Update content in our stage preview textarea after its slideout counterpart gets updated
        events.on(`form:${this.parent.id}:saveAfter`, () => {
            this.textarea.value = this.parent.dataStore.get("content") as string;
        });
    }

    /**
     * Save current value of textarea in data store
     */
    public onTextareaKeyUp()
    {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.parent.dataStore.update(this.textarea.value, "content");
    }

    /**
     * Start stage interaction on textarea blur
     */
    public onTextareaFocus()
    {
        $(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStart");
    }

    /**
     * Stop stage interaction on textarea blur
     */
    public onTextareaBlur()
    {
        $(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStop");
    }

    /**
     * Adjust textarea's height based on scrollHeight
     */
    private adjustTextareaHeightBasedOnScrollHeight()
    {
        this.textarea.style.height = "";
        $(this.textarea).height(this.textarea.scrollHeight);
    }
}
