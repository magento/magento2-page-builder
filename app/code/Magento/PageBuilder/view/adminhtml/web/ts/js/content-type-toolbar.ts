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

/**
 * @api
 */
export default class Toolbar {
    public options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);
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
        const currentValue: string = this.preview.parent.dataStore.get<string>(option.key);
        this.preview.updateData(option.key, currentValue === value.value ? defaultValue : value.value);
    }

    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {Preview} context
     * @param {Event} event
     */
    public onFocusIn(context: Preview, event: Event): void {
        const currentContentTypeTarget = $(event.currentTarget).closest(".pagebuilder-content-type");
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
        const currentContentTypeTarget = $(event.currentTarget).closest(".pagebuilder-content-type");
        $(currentContentTypeTarget).removeClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStop");
    }
}
