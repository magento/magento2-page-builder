/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import events from "uiEvents";
import _ from "underscore";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../utils/url";
import Config, {ConfigContentBlock} from "../config";
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import Block from "./block";
import Uploader from "../uploader";

export default class Image extends Block {
    /**
     * Uploader instance
     */
    private uploader: Uploader;

    /**
     * Create image uploader and add listener for when image gets uploaded through this instance
     * {@inheritDoc}
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any) {
        super(parent, stage, config, formData);

        // Create uploader
        this.uploader = new Uploader(
            this.id,
            "imageuploader_" + this.id,
            Object.assign({}, Uploader.config, {
                value: this.stage.store.get(this.id).image
            })
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
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    public getMainImageAttributes() {
        const data = this.getData();
        if (data.image === "" || data.image === undefined) {
            return {};
        } else if (_.isEmpty(data.image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.image), alt: data.alt, title: data.title_tag };
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */
    public getMobileImageAttributes() {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return {};
        } else if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return {src: this.getImageUrl(data.mobile_image), alt: data.alt, title: data.title_tag };
    }

    /**
     * Retrieve the image attributes
     *
     * @returns {any}
     */
    public getImageLinkAttributes() {
        const data = this.getData();
        return {
            href: data.link_url || "",
            target: data.link_target || "_self",
            title: data.title_tag,
        };
    }

    /**
     * Get the image value held in preview block
     *
     * @returns {String|null}
     */
    public getPreviewImageUrl() {
        return this.preview.data.image() && this.preview.data.image()[0] !== undefined
            ? this.preview.data.image()[0].url
            : null;
    }

    /**
     * Retrieve the image URL with directive
     *
     * @param {{}} image
     * @returns {string}
     */
    private getImageUrl(image: any[]) {
        const imageUrl = image[0].url;
        const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getInitConfig("media_url"), imageUrl);

        const mediaPath = imageUrl.split(mediaUrl);
        const directive = "{{media url=" + mediaPath[1] + "}}";
        return directive;
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
