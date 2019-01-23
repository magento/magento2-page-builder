/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import {OptionInterface} from "./content-type-toolbar/option";
import ValueInterface from "./content-type-toolbar/value";
import Preview from "./content-type/preview";
import CheckStageFullScreen from "./utils/check-stage-full-screen";

/**
 * @api
 */
export default class Toolbar {
    public options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);
    public observer: MutationObserver;
    private preview: Preview;

    /**
     * Toolbar Options constructor
     *
     * @param preview
     * @param options
     */
    constructor(preview: Preview, options: OptionInterface[]) {
        this.preview = preview;
        this.options(options);
    }

    /**
     * Toolbar template
     *
     * @returns {string}
     */
    get template(): string {
         return "Magento_PageBuilder/content-type-toolbar";
    }

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    public onOptionClick(option: OptionInterface, value: ValueInterface) {
        const defaultValue: string = this.preview.config.fields[option.key].default as string;
        const currentValue: string = this.preview.parent.dataStore.get(option.key) as string;
        this.preview.updateData(option.key, currentValue === value.value ? defaultValue : value.value);
    }

    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onFocusIn(context: Preview, event: Event): void {
        const currentContentTypeTarget = context.toolbar.getCurrentContentTypeTarget();
        const toolbarOptions = currentContentTypeTarget.find(".pagebuilder-toolbar-options");
        // Change toolbar orientation if overflow on full screen mode
        if (CheckStageFullScreen(context.parent.stageId)
            && currentContentTypeTarget[0].getBoundingClientRect().top < toolbarOptions.outerHeight()) {
            context.toolbar.observer = new MutationObserver(() => {
                toolbarOptions.css("transform", "translateY(" + currentContentTypeTarget.outerHeight() + "px)");
            });
            context.toolbar.observer.observe(currentContentTypeTarget[0], {
                    attributes: true,
                    childList: true,
                    subtree: true,
                });
            toolbarOptions.css("transform", "translateY(" + currentContentTypeTarget.outerHeight() + "px)");
        } else {
            toolbarOptions.css("transform", "translateY(-100%)");
        }
        $(currentContentTypeTarget).addClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStart");
    }

    /**
     * Set state based on toolbar focusout event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onFocusOut(context: Preview, event: Event): void {
        const currentContentTypeTarget = context.toolbar.getCurrentContentTypeTarget();
        currentContentTypeTarget.removeClass("pagebuilder-toolbar-active");
        currentContentTypeTarget.find(".pagebuilder-toolbar-options").css("transform", "");
        if (typeof context.toolbar.observer !== "undefined"){
            context.toolbar.observer.disconnect();
        }
        events.trigger("stage:interactionStop");
    }

    /**
     * Get fixed toolbar container element referenced as selector in wysiwyg adapter settings
     *
     * @returns {jQuery}
     */
    private getCurrentContentTypeTarget() {
        return $(`#${this.preview.parent.id}`).find(".pagebuilder-content-type");
    }
}
