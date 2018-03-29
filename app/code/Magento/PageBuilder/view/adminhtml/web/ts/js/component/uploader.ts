/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";
import events from "uiEvents";
import layout from "uiLayout";
import registry from "uiRegistry";

export default class Uploader {
    /**
     * Hardcoded configuration for uploader instances; to be removed in MAGETWO-89470
     * @returns {Object}
     */
    public static getDefaultConfig() {
        return {
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
    }

    /**
     * Id of uploader instance
     */
    private id: string;

    /**
     * Name of uploader instance
     */
    private name: string;

    /**
     * Config data of uploader instance
     */
    private config: object;

    /**
     * @param {String} id
     * @param {String} name - Name to use for lookup reference in registry
     * @param {Object} config
     */
    constructor(id: string, name: string, config: object = Uploader.getDefaultConfig()) {
        config.id = this.id = id;
        config.name = this.name = name;

        this.config = config;

        // Render uploader
        this.render();
    }

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */
    public getUiComponent() {
        return registry.async(this.name);
    }

    /**
     * Register callback when file is uploaded through this instance
     *
     * @param {Function} callback - callback function containing array of file objects as argument
     */
    public onUploaded(callback: (files: object[]) => any) {
        events.on("image:uploaded:" + this.id, callback);
    }

    /**
     * Instantiate uploader through layout UI component renderer
     */
    private render() {
        layout([this.config]);
    }
}
