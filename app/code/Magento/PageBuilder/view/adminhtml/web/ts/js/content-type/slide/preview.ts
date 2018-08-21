/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import "Magento_PageBuilder/js/resource/slick/slick.min";
import Config from "../../config";
import ContentTypeCollectionInterface from "../../content-type-collection";
import ContentTypeConfigInterface from "../../content-type-config.d";
import Options from "../../content-type-menu";
import Option from "../../content-type-menu/option";
import OptionInterface from "../../content-type-menu/option.d";
import ContentTypeInterface from "../../content-type.d";
import {DataObject} from "../../data-store";
import ObservableUpdater from "../observable-updater";
import BasePreview from "../preview";
import Uploader from "../uploader";
import Wysiwyg from "../wysiwyg";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");
    /**
     * Wysiwyg instance
     */
    private wysiwyg: Wysiwyg;

    /**
     * The element the text content type is bound to
     */
    private element: HTMLElement;

    /**
     * Uploader instance
     */
    private uploader: Uploader;

    /**
     * Slider transform
     */
    private sliderTransform: string;

    /**
     * Slider selector
     */
    private sliderSelector: string = ".slick-list";

    /**
     * Slider content selector
     */
    private sliderContentSelector: string = ".slick-track";

    /**
     * Slide selector
     */
    private slideSelector: string = ".slick-slide";

    /**
     * Active slide selector
     */
    private activeSlideSelector: string = ".slick-current";

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        observableUpdater: ObservableUpdater,
    ) {
        super(parent, config, observableUpdater);
        const slider = this.parent.parent;
        this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
        slider.children.subscribe((children) => {
            const index = children.indexOf(this.parent);
            this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
        });
    }

    /**
     * @param {HTMLElement} element
     */
    public initWysiwyg(element: HTMLElement) {
        if (!Config.getConfig("can_use_inline_editing_on_stage")) {
            return;
        }

        // TODO: Temporary solution, blocked by other team. Move configuration override to correct place.
        this.config.additional_data.wysiwygConfig
            .wysiwygConfigData.adapter.settings.fixed_toolbar_container = ".wysiwyg-container";
        this.element = element;

        element.id = this.parent.id + "-editor";

        this.wysiwyg = new Wysiwyg(
            this.parent.id,
            element.id,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.parent.dataStore,
        );

        this.wysiwyg.onFocus(this.onFocus.bind(this));
        this.wysiwyg.onBlur(this.onBlur.bind(this));
    }

    /**
     * Get the background wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getBackgroundStyles() {
        const desktopStyles = this.data.desktop_image.style();
        return {
            ...desktopStyles,
            paddingBottom: "",
            paddingLeft: "",
            paddingRight: "",
            paddingTop: "",
            borderStyle: "none",
            borderRadius: "0px",
        };
    }

    /**
     * Get the slide wrapper attributes for the preview
     *
     * @returns {any}
     */
    public getPaddingStyles() {
        const previewData = this.previewData;
        const appearance = this.data.main.attributes()["data-appearance"];
        const paddingData: any =  {};
        switch (appearance) {
            case "collage-centered":
                paddingData.paddingLeft = `calc(25% + ${this.data.desktop_image.style().paddingLeft})`;
                paddingData.paddingRight = `calc(25% + ${this.data.desktop_image.style().paddingRight})`;
                break;
            case "collage-left":
                paddingData.paddingRight = `calc(50% + ${this.data.desktop_image.style().paddingRight})`;
                break;
            case "collage-right":
                paddingData.paddingLeft = `calc(50% + ${this.data.desktop_image.style().paddingLeft})`;
                break;
            default:
                break;
        }
        let backgroundImage: string = "none";
        if (previewData.background_image() && previewData.background_image() !== "" &&
            previewData.background_image() !== undefined &&
            previewData.background_image()[0] !== undefined) {
            backgroundImage = "url(" + previewData.background_image()[0].url + ")";
        }
        const styles =  {
            backgroundImage,
            backgroundSize: previewData.background_size(),
            minHeight: previewData.min_height() ? previewData.min_height() + "px" : "300px",
            paddingBottom: this.data.desktop_image.style().paddingBottom || "",
            paddingLeft: this.data.desktop_image.style().paddingLeft || "",
            paddingRight: this.data.desktop_image.style().paddingRight || "",
            paddingTop: this.data.desktop_image.style().paddingTop || "",
        };
        return {
            ...styles,
            ...paddingData,
        };
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
     * Extract data values our of observable functions
     * Update the style attribute mapper converts images to directives, override it to include the correct URL
     *
     * @param {StyleAttributeMapperResult} styles
     * @returns {StyleAttributeMapperResult}
     */

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    public getOptions(): Options {
        const options = super.getOptions();
        options.removeOption("move");
        return options;
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    public getUploader() {
        return this.uploader;
    }

    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */
    public retrieveOptions(): OptionInterface[] {
        const options = super.retrieveOptions();
        const newOptions = options.filter((option) => {
            return (option.code !== "remove");
        });
        const removeClasses = ["remove-structural"];
        let removeFn = () => {
            const index = (this.parent.parent as ContentTypeCollectionInterface).getChildren().indexOf(this.parent);
            this.onOptionRemove();
            // Invoking methods on slider
            this.parent.parent.onAfterRender();
            this.parent.parent.setFocusedSlide(index - 1);
        };
        if (this.parent.parent.children().length <= 1) {
            removeFn = () => { return; };
            removeClasses.push("disabled");
        }
        newOptions.push(new Option(
            this,
            "remove",
            "<i class='icon-admin-pagebuilder-remove'></i>",
            $t("Remove"),
            removeFn,
            removeClasses,
            100,
        ));
        return newOptions;
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
            const dataStore = this.parent.dataStore.get();
            const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

            // Create uploader
            this.uploader = new Uploader(
                "imageuploader_" + this.parent.id,
                this.config.additional_data.uploaderConfig,
                this.parent.id,
                this.parent.dataStore,
                initialImageValue,
            );
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
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    private onFocus() {
        const $element = $(this.element);
        const $slider = $($element.parents(this.sliderSelector));
        const sliderContent = $element.parents(this.sliderContentSelector)[0];
        const $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

        $.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, (i, selector) => {
            $element.closest(selector as string).css("z-index", 100);
        });

        // Disable slider keyboard events and fix problem with overflow hidden issue
        $($slider.parent()).slick("slickSetOption", "accessibility", false, true);
        $notActiveSlides.hide();
        this.sliderTransform = sliderContent.style.transform;
        sliderContent.style.transform = "";
        $slider.css("overflow", "visible");
    }

    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     * Fixes slider
     */
    private onBlur() {
        const $element = $(this.element);
        const $slider = $($element.parents(this.sliderSelector));
        const sliderContent = $element.parents(this.sliderContentSelector)[0];
        const $notActiveSlides = $slider.find(this.slideSelector).not(this.activeSlideSelector);

        $.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, (i, selector) => {
            $element.closest(selector as string).css("z-index", "");
        });

        // Enable slider keyboard events and revert changes made in onFocus
        $slider.css("overflow", "hidden");
        sliderContent.style.transform = this.sliderTransform;
        $notActiveSlides.show();
        $($slider.parent()).slick("slickSetOption", "accessibility", true, true);

    }
}
