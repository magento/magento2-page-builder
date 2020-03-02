/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import _ from "underscore";
import {PreviewSortableSortUpdateEventParams} from "../../binding/sortable-children.types";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import {DataObject} from "../../data-store";
import Uploader from "../../uploader";
import delayUntil from "../../utils/delay-until";
import {
    createBookmark, createDoubleClickEvent,
    findNodeIndex, getActiveEditor, getNodeByIndex,
    isWysiwygSupported,
    lockImageSize,
    moveToBookmark,
    unlockImageSize,
} from "../../utils/editor";
import nestingLinkDialog from "../../utils/nesting-link-dialog";
import WysiwygFactory from "../../wysiwyg/factory";
import WysiwygInterface from "../../wysiwyg/wysiwyg-interface";
import {ContentTypeMountEventParamsInterface} from "../content-type-events.types";
import BasePreview from "../preview";
import SliderPreview from "../slider/preview";

/**
 * @api
 */
export default class Preview extends BasePreview {
    public buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Slide name
     */
    public slideName: KnockoutObservable<string> = ko.observable();

    /**
     * Wysiwyg deferred event
     */
    private wysiwygDeferred: JQueryDeferred<void> = $.Deferred();

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
     * Have we handled a double click on init?
     */
    private handledDoubleClick: boolean = false;

    /**
     * @param {HTMLElement} element
     */
    public afterRenderWysiwyg(element: HTMLElement) {
        this.element = element;
        element.id = this.contentType.id + "-editor";

        // Set the innerHTML manually so we don't upset Knockout & TinyMCE
        element.innerHTML = this.data.content.html();
        this.contentType.dataStore.subscribe(() => {
            // If we're not focused into TinyMCE inline, update the value when it changes in the data store
            if (!this.wysiwyg || (this.wysiwyg && this.wysiwyg.getAdapter().id !== getActiveEditor().id)) {
                element.innerHTML = this.data.content.html();
            }
        }, "content");

        /**
         * afterRenderWysiwyg is called whenever Knockout causes a DOM re-render. This occurs frequently within Slider
         * due to Slick's inability to perform a refresh with Knockout managing the DOM. Due to this the original
         * WYSIWYG instance will be detached from this slide and we need to re-initialize on click.
         */
        this.wysiwyg = null;
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
        const initialImageValue = this.contentType.dataStore
            .get<object[]>(this.config.additional_data.uploaderConfig.dataScope, "");

        // Create uploader
        return new Uploader(
            "imageuploader_" + this.contentType.id,
            this.config.additional_data.uploaderConfig,
            this.contentType.id,
            this.contentType.dataStore,
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
        } else if (this.element && this.wysiwyg) {
            const element = this.element || this.textarea;

            if (event.currentTarget !== event.target &&
                event.target !== element &&
                !element.contains(event.target)
            ) {
                return;
            }

            element.focus();
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
        return isWysiwygSupported();
    }

    /**
     * @param {HTMLTextAreaElement} element
     */
    public initTextarea(element: HTMLTextAreaElement)
    {
        this.textarea = element;

        // set initial value of textarea based on data store
        this.textarea.value = this.contentType.dataStore.get<string>("content");
        this.adjustTextareaHeightBasedOnScrollHeight();

        // Update content in our stage preview textarea after its slideout counterpart gets updated
        events.on(`form:${this.contentType.id}:saveAfter`, () => {
            this.textarea.value = this.contentType.dataStore.get<string>("content");
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
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`${this.config.name}:${this.contentType.id}:updateAfter`, () => {
            const dataStore = this.contentType.dataStore.getState();
            const imageObject = (dataStore[this.config.additional_data.uploaderConfig.dataScope] as object[])[0] || {};
            events.trigger(`image:${this.contentType.id}:assignAfter`, imageObject);
            nestingLinkDialog(this.contentType.dataStore, this.wysiwyg, "content", "link_url");
        });

        // Remove wysiwyg before assign new instance.
        events.on("childContentType:sortUpdate", (args: PreviewSortableSortUpdateEventParams) => {
            if (args.instance.id === this.contentType.parentContentType.id) {
               this.wysiwyg = null;
            }
        });

        events.on(`${this.config.name}:mountAfter`, (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                // Update the display label for the slide
                const slider = this.contentType.parentContentType;
                this.displayLabel($t(`Slide ${slider.children().indexOf(this.contentType) + 1}`));
                slider.children.subscribe((children) => {
                    const index = children.indexOf(this.contentType);
                    this.displayLabel($t(`Slide ${slider.children().indexOf(this.contentType) + 1}`));
                });
            }
        });

        events.on(`${this.config.name}:renderAfter`, (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                const slider = this.contentType.parentContentType;

                $((slider.preview as SliderPreview).element).on("beforeChange", () => {
                    this.slideChanged = false;
                });
                $((slider.preview as SliderPreview).element).on("afterChange", () => {
                    this.slideChanged = true;
                });
            }
        });

        this.contentType.dataStore.subscribe(
            (data: DataObject) => {
                this.slideName(data.slide_name);
            },
        );
    }

    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */
    private onImageUploaded(data: object[]) {
        this.contentType.dataStore.set(
            this.config.additional_data.uploaderConfig.dataScope,
            data,
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
