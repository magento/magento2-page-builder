/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import ContentType from "../../content-type";
import {ConfigContentBlock} from "../config";
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import Uploader from "../uploader";
import DataConverterPool from "./data-converter-pool";
import ElementConverterPool from "./element-converter-pool";

export default class Image extends ContentType {
    /**
     * Uploader instance
     */
    private uploader: Uploader;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {number} stageId
     */
    constructor(
        parent: EditableArea,
        config: ConfigContentBlock,
        stageId,
    ) {
        super(parent, config, stageId);

        // Create uploader
        this.uploader = new Uploader(
            this.id,
            "imageuploader_" + this.id,
            Object.assign({}, Uploader.getDefaultConfig(), {
                value: this.store.get(this.id).image,
            }),
        );

        // Register listener when image gets uploaded from uploader UI component
        this.uploader.onUploaded(this.onImageUploaded.bind(this));

        // Notify all subscribers when preview image data gets modified
        this.preview.previewData.image.subscribe((data) => {
            events.trigger("image:assigned:" + this.id, data[0]);
        });
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
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */
    private onImageUploaded(data: object[]) {
        this.store.updateKey(
            this.id,
            data,
            "image",
        );
    }
}
