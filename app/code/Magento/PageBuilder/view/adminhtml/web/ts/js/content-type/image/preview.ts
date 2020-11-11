/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ContentTypeReadyEventParamsInterface} from "Magento_PageBuilder/js/content-type/content-type-events.types";
import events from "Magento_PageBuilder/js/events";
import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import Uploader from "../../uploader";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {

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
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    public getUploader() {
        const initialImageValue = this.contentType.dataStore
            .get<object[]>(this.config.additional_data.uploaderConfig.dataScope, "");

        return new Uploader(
            "imageuploader_" + this.contentType.id,
            this.config.additional_data.uploaderConfig,
            this.contentType.id,
            this.contentType.dataStore,
            initialImageValue,
        );
    }

    /**
     * Get viewport image data
     */
    public getViewportImageData() {
        const desktopImageData = this.data.desktop_image;
        const mobileImageData = this.data.mobile_image;
        return this.viewport() === "mobile" && typeof mobileImageData !== "undefined"
            ? mobileImageData : desktopImageData;
    }

    /**
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on("image:mountAfter", (args: ContentTypeReadyEventParamsInterface) => {
            if (args.id === this.contentType.id) {
                this.isSnapshot.subscribe((value) => {
                    this.changeUploaderControlsVisibility();
                });
                this.changeUploaderControlsVisibility();
            }
        });

        events.on(`${this.config.name}:${this.contentType.id}:updateAfter`, () => {
            const files = this
                .contentType
                .dataStore
                .get<object[]>(this.config.additional_data.uploaderConfig.dataScope);
            const imageObject: object = files ? (files[0] as object) : {};
            events.trigger(`image:${this.contentType.id}:assignAfter`, imageObject);
        });
    }

    /**
     * Change uploader controls visibility
     */
    private changeUploaderControlsVisibility() {
        this.getUploader().getUiComponent()((uploader: any) => {
            uploader.visibleControls = !this.isSnapshot();
        });
    }
}
