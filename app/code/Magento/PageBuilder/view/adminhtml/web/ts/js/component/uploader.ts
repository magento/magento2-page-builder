/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $t from "mage/translate";

export default class Uploader {
    /**
     * Configuration passed to uploader upon instantiation
     */
    public static config: object = {
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
