/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.d";
import {DataObject} from "../../data-store";
import {StyleAttributeMapperResult} from "../../master-format/style-attribute-mapper";
import ContentTypeMountEventParamsInterface from "../content-type-mount-event-params";
import BasePreview from "../preview";
import Uploader from "../uploader";

/**
 * @api
 */
export default class Preview extends BasePreview {
    private buttonPlaceholder: string = $t("Edit Button Text");

    /**
     * Uploader instance
     */
    private uploader: Uploader;

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
            overflow: "hidden",
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
        return this.uploader;
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

        events.on(`${this.config.name}:mountAfter`, (args: ContentTypeMountEventParamsInterface) => {
            if (args.id === this.parent.id) {
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

                // Update the display label for the slide
                const slider = this.parent.parent;
                this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
                slider.children.subscribe((children) => {
                    const index = children.indexOf(this.parent);
                    this.displayLabel($t(`Slide ${slider.children().indexOf(this.parent) + 1}`));
                });
            }
        });
    }

    protected afterStyleMapped(styles: StyleAttributeMapperResult): StyleAttributeMapperResult {
        // Extract data values our of observable functions
        // The style attribute mapper converts images to directives, override it to include the correct URL
        const data = this.previewData;
        if (data.background_image() && typeof data.background_image()[0] === "object") {
            styles.backgroundImage = "url(" + data.background_image()[0].url + ")";
        }
        if (data.mobile_image()
            && data.mobile_image() !== ""
            && typeof data.mobile_image()[0] === "object"
        ) {
            styles.mobileImage = "url(" + data.mobile_image()[0].url + ")";
        }
        return styles;
    }
}
