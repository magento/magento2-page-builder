/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

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
     * @inheritDoc
     */
    protected bindEvents() {
        super.bindEvents();

        events.on(`${this.config.name}:${this.contentType.id}:updateAfter`, () => {
            const files = this
                .contentType
                .dataStore
                .get<object[]>(this.config.additional_data.uploaderConfig.dataScope);
            const imageObject: object = files ? (files[0] as object) : {};
            events.trigger(`image:${this.contentType.id}:assignAfter`, imageObject);
        });
    }
}
