/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import {ConfigContentBlock} from "../config";
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import Uploader from "../uploader";
import Block from "./block";
import DataConverterPool from "./data-converter-pool";
import ElementConverterPool from "./element-converter-pool";

export default class Image extends Block {
    /**
     * Uploader instance
     */
    private uploader: Uploader;

    /**
     * Create image uploader and add listener for when image gets uploaded through this instance
     * {@inheritDoc}
     */
    constructor(
        parent: EditableArea,
        stage: Stage,
        config: ConfigContentBlock,
        formData: any,
        elementConverterPool: ElementConverterPool,
        dataConverterPool: DataConverterPool,
    ) {
        super(parent, stage, config, formData, elementConverterPool, dataConverterPool);

        const uploaderConfiguration = Object.assign(
            {},
            config.additional_data.uploaderConfig.settings,
            {
                value: this.stage.store.get(this.id).image,
            },
        );

        // Create uploader
        this.uploader = new Uploader(
            this.id,
            "imageuploader_" + this.id,
            uploaderConfiguration,
        );

        // Register listener when image gets uploaded from uploader UI component
        this.uploader.onUploaded(this.onImageUploaded.bind(this));

        // Notify all subscribers when preview image data gets modified
        this.preview.data.image.subscribe((data) => {
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
        this.stage.store.updateKey(
            this.id,
            data,
            "image",
        );
    }
}
