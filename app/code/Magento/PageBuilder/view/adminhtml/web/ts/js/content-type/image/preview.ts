/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "Magento_PageBuilder/js/events";
import {DataObject} from "../../data-store";
import BasePreview from "../preview";
import Uploader from "../uploader";

/**
 * @api
 */
export default class Preview extends BasePreview {
    /**
     * Uploader instance
     */
    private uploader: Uploader;

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
            const files: object[] = (dataStore[this.config.additional_data.uploaderConfig.dataScope] as object[]);
            const imageObject: object = files ? (files[0] as object) : {};
            events.trigger(`image:${this.parent.id}:assignAfter`, imageObject);
        });

        events.on(`${this.config.name}:mountAfter`, () => {
            const dataStore = this.parent.dataStore.get() as DataObject;
            const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

            // Create uploader
            this.uploader = new Uploader(
                this.parent.id,
                "myimageuploader_" + this.parent.id,
                Object.assign({}, this.config.additional_data.uploaderConfig, {
                    value: initialImageValue,
                }),
            );

            // Register listener when image gets uploaded from uploader UI component
            this.uploader.onUploaded(this.onImageUploaded.bind(this));
            // Register listener when image gets deleted from uploader UI component
            this.uploader.onDeleted(this.onImageDeleted.bind(this));
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
     * Remove image data
     */
    private onImageDeleted() {
        this.parent.dataStore.update(
            "",
            this.config.additional_data.uploaderConfig.dataScope,
        );
    }
}
