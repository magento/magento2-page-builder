/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import Preview from "../../../preview";
import EventBus from "../../event-bus";
import Uploader from "../../uploader";

export default class Image extends Preview {
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

        EventBus.on(`${this.parent.id}:updated`, (event, params) => {
            const imageDataStore = this.parent.store.get(this.parent.id);
            const imageObject = imageDataStore.image[0] || {};
            events.trigger(`image:assigned:${this.parent.id}`, imageObject);
        });

        EventBus.once("image:block:ready", (event, params) => {
            const imageDataStore = this.parent.store.get(this.parent.id);
            const initialImageValue = imageDataStore.image || "";

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
        this.parent.store.updateKey(
            this.parent.id,
            data,
            "image",
        );
    }
}
