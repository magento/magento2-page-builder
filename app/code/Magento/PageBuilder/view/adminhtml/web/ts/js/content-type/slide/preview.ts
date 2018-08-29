/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "Magento_PageBuilder/js/events";
import ConditionalRemoveOption from "../../content-type-menu/conditional-remove-option";
import {OptionsInterface} from "../../content-type-menu/option.d";
import {DataObject} from "../../data-store";
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
}
