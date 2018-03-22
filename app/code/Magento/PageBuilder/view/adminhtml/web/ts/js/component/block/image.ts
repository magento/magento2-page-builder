/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "uiEvents";
import layout from "uiLayout";
import registry from "uiRegistry";
import _ from "underscore";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../utils/url";
import Config, {ConfigContentBlock} from "../config";
import Stage from "../stage";
import EditableArea from "../stage/structural/editable-area";
import Block from "./block";

export default class Image extends Block {
    /**
     * Name of the uploader instance
     */
    private uploaderName: string;

    /**
     * Configuration passed to uploader upon instantiation
     */
    private uploaderConfig: object = {
        allowedExtensions: "jpg jpeg gif png",
        component: "Magento_PageBuilder/js/form/element/image-uploader",
        componentType: "imageUploader",
        dataScope: "image",
        formElement: "imageUploader",
        initialMediaGalleryOpenSubpath: "wysiwyg",
        maxFileSize: "4194304",
        mediaGallery: {
            initialOpenSubpath: "wysiwyg",
            openDialogTitle: $t("Insert Images..."),
            openDialogUrl: "/admin/cms/wysiwyg_images/index/",
            storeId: "1",
        },
        template: "Magento_PageBuilder/form/element/stage/preview/uploader/image",
        uploaderConfig: {
            url: "/admin/pagebuilder/contenttype/image_upload/",
        },
        validation: {
            "required-entry": true,
        },
    };

    /**
     * Create image uploader and add listener for when image gets uploaded through this instance
     * {@inheritDoc}
     */
    constructor(parent: EditableArea, stage: Stage, config: ConfigContentBlock, formData: any) {
        super(parent, stage, config, formData);
        this.createUploader();
        this.listenImageUploaded();
    }

    /**
     * Register listener when image gets uploaded from uploader UI component
     */
    private listenImageUploaded() {
        events.on("image:uploaded:" + this.id, this.onImageUploaded.bind(this));
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

    /**
     * Instantiate uploader through layout UI component renderer
     */
    private createUploader() {
        this.uploaderName = "imageuploader_" + this.id;
        this.uploaderConfig.name = this.uploaderName;
        this.uploaderConfig.id = this.id;

        // set reference to current image value in stage's data store
        this.uploaderConfig.value = this.stage.store.get(this.id).image;

        layout([this.uploaderConfig]);
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */
    public getUploader() {
        return registry.async(this.uploaderName);
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

}
