/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
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

        events.on(`${this.parent.id}:updated`, () => {
            const dataStore = this.parent.dataStore.get();
            const imageObject = dataStore[this.config.additional_data.uploaderConfig.dataScope][0] || {};
            events.trigger(`image:assigned:${this.parent.id}`, imageObject);
        });

        events.on(`${this.config.name}:contentType:ready`, () => {
            const dataStore = this.parent.dataStore.get();
            const initialImageValue = dataStore[this.config.additional_data.uploaderConfig.dataScope] || "";

            // Create uploader
            this.uploader = new Uploader(
                this.parent.id,
                "imageuploader_" + this.parent.id,
                Object.assign({}, this.config.additional_data.uploaderConfig, {
                    value: initialImageValue,
                }),
            );

            // Register listener when image gets uploaded from uploader UI component
            this.uploader.onUploaded(this.onImageUploaded.bind(this));
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
