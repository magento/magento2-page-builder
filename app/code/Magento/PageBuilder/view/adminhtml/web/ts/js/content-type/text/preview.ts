/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import {DataObject} from "../../data-store";
import delayUntil from "../../utils/delay-until";
import {
    createBookmark,
    createDoubleClickEvent,
    escapeDoubleQuoteWithinWidgetDirective,
    findNodeIndex,
    getActiveEditor,
    getNodeByIndex,
    isWysiwygSupported,
    lockImageSize,
    moveToBookmark,
    replaceDoubleQuoteWithSingleQuoteWithinVariableDirective,
    unlockImageSize,
} from "../../utils/editor";
import WysiwygFactory from "../../wysiwyg/factory";
import WysiwygInterface from "../../wysiwyg/wysiwyg-interface";
import {ContentTypeMountEventParamsInterface} from "../content-type-events.types";
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
     * Wysiwyg deferred event
     */
    private wysiwygDeferred: JQueryDeferred<void> = $.Deferred();

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * Deferred called once the render is completed
     */
    private afterRenderDeferred: JQueryDeferred<HTMLElement> = $.Deferred();

    /**
     * The textarea element in disabled mode
     */
    private textarea: HTMLTextAreaElement;

    /**
     * Have we handled a double click on init?
     */
    private handledDoubleClick: boolean = false;

    /**
     * @returns {Boolean}
     */
    public isWysiwygSupported(): boolean {
        return isWysiwygSupported();
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
    public afterRenderWysiwyg(element: HTMLElement) {
        this.element = element;
        element.id = this.contentType.id + "-editor";

        // Set the innerHTML manually so we don't upset Knockout & TinyMCE
        element.innerHTML = this.data.main.html();
        this.contentType.dataStore.subscribe(() => {
            // If we're not focused into TinyMCE inline, update the value when it changes in the data store
            if (!this.wysiwyg || (this.wysiwyg && this.wysiwyg.getAdapter().id !== getActiveEditor().id)) {
                element.innerHTML = this.data.main.html();
            }
        }, "content");

        this.afterRenderDeferred.resolve(element);

        /**
         * afterRenderWysiwyg is called whenever Knockout causes a DOM re-render. This occurs frequently within Slider
         * due to Slick's inability to perform a refresh with Knockout managing the DOM. Due to this the original
         * WYSIWYG instance will be detached from this slide and we need to re-initialize on click.
         */
        this.wysiwyg = null;
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
     * Init WYSIWYG on load
     *
     * @param element
     * @deprecated please use activateEditor & initWysiwygFromClick
     */
    public initWysiwyg(element: HTMLElement) {
        this.element = element;
        element.id = this.contentType.id + "-editor";
        this.wysiwyg = null;

        return this.initWysiwygFromClick(true);
    }

    /**
     * Init the WYSIWYG
     *
     * @param {boolean} focus Should wysiwyg focus after initialization?
     * @returns Promise
     */
    public initWysiwygFromClick(focus: boolean = false): Promise<WysiwygInterface> {
        if (this.wysiwyg) {
            return Promise.resolve(this.wysiwyg);
        }

        const wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;

        wysiwygConfig.adapter.settings.paste_as_text = true;

        if (focus) {
            wysiwygConfig.adapter.settings.auto_focus = this.element.id;
            wysiwygConfig.adapter.settings.init_instance_callback = () => {
                _.defer(() => {
                    this.element.blur();
                    this.element.focus();
                });
            };
        }

        return WysiwygFactory(
            this.contentType.id,
            this.element.id,
            this.config.name,
            wysiwygConfig,
            this.contentType.dataStore,
            "content",
            this.contentType.stageId,
        ).then((wysiwyg: WysiwygInterface): WysiwygInterface => {
            this.wysiwyg = wysiwyg;
            return wysiwyg;
        });
    }

    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    public activateEditor(preview: Preview, event: JQueryEventObject) {
        if (this.element && !this.wysiwyg) {
            const bookmark = createBookmark(event);
            lockImageSize(this.element);
            this.element.removeAttribute("contenteditable");
            _.defer(() => {
                this.initWysiwygFromClick(true)
                    .then(() => delayUntil(
                        () => {
                            // We no longer need to handle double click once it's initialized
                            this.handledDoubleClick = true;
                            this.wysiwygDeferred.resolve();
                            moveToBookmark(bookmark);
                            unlockImageSize(this.element);
                        },
                        () => this.element.classList.contains("mce-edit-focus"),
                        10,
                    )).catch((error) => {
                    // If there's an error with init of WYSIWYG editor push into the console to aid support
                    console.error(error);
                });
            });
        }
    }

    /**
     * If a user double clicks prior to initializing TinyMCE, forward the event
     *
     * @param preview
     * @param event
     */
    public handleDoubleClick(preview: Preview, event: JQueryEventObject) {
        if (this.handledDoubleClick) {
            return;
        }
        event.preventDefault();
        const targetIndex = findNodeIndex(this.element, event.target.tagName, event.target);
        this.handledDoubleClick = true;

        this.wysiwygDeferred.then(() => {
            let target = document.getElementById(event.target.id);
            if (!target) {
                target = getNodeByIndex(this.element, event.target.tagName, targetIndex);
            }

            if (target) {
                target.dispatchEvent(createDoubleClickEvent());
            }
        });
    }

    /**
     * @param {HTMLTextAreaElement} element
     */
    public initTextarea(element: HTMLTextAreaElement) {
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
    public onTextareaKeyUp() {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.contentType.dataStore.set("content", this.textarea.value);
    }

    /**
     * Start stage interaction on textarea blur
     */
    public onTextareaFocus() {
        $(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStart");
    }

    /**
     * Stop stage interaction on textarea blur
     */
    public onTextareaBlur() {
        $(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");
        events.trigger("stage:interactionStop");
    }

    /**
     * Retrieve the margin & padding & alignment styles for the placeholder
     *
     * @returns {any}
     */
    public getPlaceholderStyle() {
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
     * Bind events
     */
    protected bindEvents() {
        super.bindEvents();

        this.contentType.dataStore.subscribe((state: DataObject) => {
            const sanitizedContent = replaceDoubleQuoteWithSingleQuoteWithinVariableDirective(
                escapeDoubleQuoteWithinWidgetDirective(state.content),
            );

            if (sanitizedContent !== state.content) {
                state.content = sanitizedContent;
            }
        });

        // After drop of new content type open TinyMCE and focus
        events.on("text:dropAfter", (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                this.afterRenderDeferred.then(() => {
                    if (this.isWysiwygSupported()) {
                        this.initWysiwygFromClick(true);
                    }
                });
            }
        });
    }

    /**
     * Adjust textarea's height based on scrollHeight
     */
    private adjustTextareaHeightBasedOnScrollHeight() {
        this.textarea.style.height = "";
        const scrollHeight = this.textarea.scrollHeight;
        const minHeight = parseInt($(this.textarea).css("min-height"), 10);

        if (scrollHeight === minHeight) { // leave height at 'auto'
            return;
        }

        $(this.textarea).height(scrollHeight);
    }
}
