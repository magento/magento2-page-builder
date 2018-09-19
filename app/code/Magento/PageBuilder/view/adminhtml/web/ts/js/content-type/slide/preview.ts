/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import {PreviewSortableSortUpdateEventParams} from "../../binding/sortable-children";
import Config from "../../config";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.d";
import {DataObject} from "../../data-store";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params";
import BasePreview from "../preview";
import SliderPreview from "../slider/preview";
import Uploader from "../uploader";
import WysiwygFactory from "../wysiwyg/factory";
import WysiwygInterface from "../wysiwyg/wysiwyg-interface";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");
    /**
     * Wysiwyg instance
     */
    private wysiwyg: WysiwygInterface;

    /**
     * The textarea element in disabled mode
     */
    private textarea: HTMLTextAreaElement;

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * Slide flag
     */
    private slideChanged: boolean = true;

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
     * Set state based on overlay mouseover event for the preview
     */
    public onMouseOverWrapper() {
        // Triggers the visibility of the overlay content to show
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
        // Triggers the visibility of the overlay content to hide
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
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();
        delete options.move;
        options.remove = new ConditionalRemoveOption({
            ...options.remove.config,
            preview: this,
        });
        return options;
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    public getUploader() {
        const dataStore = this.parent.dataStore.get();
        const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

        // Create uploader
        return new Uploader(
            "imageuploader_" + this.parent.id,
            this.config.additional_data.uploaderConfig,
            this.parent.id,
            this.parent.dataStore,
            initialImageValue,
        );
    }

    /**
     * Makes WYSIWYG active
     *
     * @param {Preview} preview
     * @param {JQueryEventObject} event
     * @returns {Boolean}
     */
    public activateEditor(preview: Preview, event: JQueryEventObject) {
        const element = this.wysiwyg && this.element || this.textarea;

        if (!element ||
            !this.slideChanged ||
            event.currentTarget !== event.target &&
            event.target !== element &&
            !element.contains(event.target)
        ) {
            return false;
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
     * @returns {Boolean}
     */
    public isWysiwygSupported(): boolean {
        return Config.getConfig("can_use_inline_editing_on_stage");
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
            this.adjustTextareaHeightBasedOnScrollHeight();
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
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`${this.config.name}:${this.parent.id}:updateAfter`, () => {
            const dataStore = this.parent.dataStore.get() as DataObject;
            const imageObject = dataStore[this.config.additional_data.uploaderConfig.dataScope][0] || {};
            events.trigger(`image:${this.parent.id}:assignAfter`, imageObject);
        });

        // Remove wysiwyg before assign new instance.
        events.on("childContentType:sortUpdate", (args: PreviewSortableSortUpdateEventParams) => {
            if (args.instance.id === this.parent.parent.id) {
               this.wysiwyg = null;
            }
        });

        events.on(`${this.config.name}:mountAfter`, (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.parent.id) {
                // Update the display label for the slide
                const slider = this.parent.parent;
                this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
                slider.children.subscribe((children) => {
                    const index = children.indexOf(this.parent);
                    this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
                });
            }
        });

        events.on(`${this.config.name}:renderAfter`, (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.parent.id) {
                const slider = this.parent.parent;

                $((slider.preview as SliderPreview).element).on("beforeChange", () => {
                    this.slideChanged = false;
                });
                $((slider.preview as SliderPreview).element).on("afterChange", () => {
                    this.slideChanged = true;
                });
            }
        });
    }

    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */
    private onImageUploaded(data: object[]) {
        this.parent.dataStore.update(
            data,
            this.config.additional_data.uploaderConfig.dataScope,
        );
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
