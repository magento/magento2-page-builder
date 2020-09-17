/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import events from "Magento_PageBuilder/js/events";
import {OptionInterface, ValueInterface} from "./content-type-toolbar.types";
import Preview from "./content-type/preview";
import {PreviewCollectionInterface} from "./content-type/preview-collection.types";
import {PreviewInterface} from "./content-type/preview.types";
import checkStageFullScreen from "./utils/check-stage-full-screen";
import pageBuilderHeaderHeight from "./utils/pagebuilder-header-height";
import deferred, {DeferredInterface} from "./utils/promise-deferred";

/**
 * @api
 */
export default class Toolbar {
    public options: KnockoutObservableArray<OptionInterface> = ko.observableArray([]);
    public observer: MutationObserver;
    public afterRenderDeferred: DeferredInterface = deferred();
    private preview: Preview;
    private element: Element;

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
     * On render init the toolbar
     *
     * @param {Element} element
     */
    public afterRender(element: Element): void {
        this.element = element;
        this.afterRenderDeferred.resolve(element);
    }

    /**
     * Upon clicking the option update the value as directed
     * When user toggles the option off, set the value back to default
     *
     * @param {OptionInterface} option
     * @param {ValueInterface} value
     */
    public onOptionClick(option: OptionInterface, value: ValueInterface) {
        const appearance = this.preview.appearance() + "-appearance";
        const fields = this.preview.config.fields[appearance] ||
            this.preview.config.fields.default;
        const defaultValue: string = fields[option.key].default as string;
        const currentValue: string = this.preview.contentType.dataStore.get<string>(option.key);
        this.preview.updateData(option.key, currentValue === value.value ? defaultValue : value.value);
    }

    /**
     * Set state based on toolbar focusin event for the preview
     *
     * @param {ContentTypeToolbarPreviewInterface} context
     * @param {Event} event
     */
    public onFocusIn(context: ContentTypeToolbarPreviewInterface, event: Event): void {
        const currentContentTypeTarget = context.toolbar.getCurrentContentTypeTarget();
        const toolbarOptions = currentContentTypeTarget.find(".pagebuilder-toolbar-options");
        const currentContentTypeTargetClientRectTop = currentContentTypeTarget[0].getBoundingClientRect().top
                                                      - pageBuilderHeaderHeight(context.contentType.stageId);
        // Change toolbar orientation if overflow on full screen mode
        if (checkStageFullScreen(context.contentType.stageId)
            && currentContentTypeTargetClientRectTop < toolbarOptions.outerHeight()
        ) {
            context.toolbar.observer = new MutationObserver(() => {
                toolbarOptions.css("transform", "translateY(" + currentContentTypeTarget.outerHeight() + "px)");
            });
            context.toolbar.observer.observe(
                currentContentTypeTarget[0],
                {
                    attributes: true,
                    childList: true,
                    subtree: true,
                },
            );
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
     * @param {ContentTypeToolbarPreviewInterface} context
     * @param {Event} event
     */
    public onFocusOut(context: ContentTypeToolbarPreviewInterface, event: Event): void {
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
        return $(`#${this.preview.contentType.id}`).find(".pagebuilder-content-type");
    }
}

/**
 * Preview interface for preview instances implementation the toolbar functionality
 */
export interface ContentTypeToolbarPreviewInterface extends PreviewInterface {
    toolbar: Toolbar;
}
export interface ContentTypeToolbarPreviewCollectionInterface extends PreviewCollectionInterface {
    toolbar: Toolbar;
}
