/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import Config from "../../config";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import WysiwygFactory from "../../wysiwyg/factory";
import WysiwygInterface from "../../wysiwyg/wysiwyg-interface";
import BasePreview from "../preview";

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
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
    }

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        this.element = element;
        element.innerHTML = this.data.main.html();

        element.id = this.contentType.id + "-editor";

        const wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;
        wysiwygConfig.adapter.settings.auto_focus = this.contentType.dropped ? element.id : null;

        WysiwygFactory(
            this.contentType.id,
            element.id,
            this.config.name,
            wysiwygConfig,
            this.contentType.dataStore,
            "content",
            this.contentType.stageId,
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
        this.textarea.value = this.contentType.dataStore.get("content") as string;
        this.adjustTextareaHeightBasedOnScrollHeight();

        // Update content in our stage preview textarea after its slideout counterpart gets updated
        events.on(`form:${this.contentType.id}:saveAfter`, () => {
            this.textarea.value = this.contentType.dataStore.get("content") as string;
            this.adjustTextareaHeightBasedOnScrollHeight();
        });
    }

    /**
     * Save current value of textarea in data store
     */
    public onTextareaKeyUp()
    {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.contentType.dataStore.set("content", this.textarea.value);
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
     * Retrieve the margin & padding & alignment styles for the placeholder
     *
     * @returns {any}
     */
    public getPlaceholderStyle()
    {
        const keys = [
            "marginBottom",
            "marginLeft",
            "marginRight",
            "marginTop",
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
            "paddingTop",
            "textAlign",
        ];
        return _.pick(this.data.main.style(), (style: string, key: string) => {
            return keys.indexOf(key) !== -1;
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
