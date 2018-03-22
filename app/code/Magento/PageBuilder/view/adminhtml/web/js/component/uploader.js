/*eslint-disable */
define(["mage/translate"], function (_translate) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Uploader = function Uploader() {};

  Uploader.config = {
    allowedExtensions: "jpg jpeg gif png",
    component: "Magento_PageBuilder/js/form/element/image-uploader",
    componentType: "imageUploader",
    dataScope: "image",
    formElement: "imageUploader",
    initialMediaGalleryOpenSubpath: "wysiwyg",
    maxFileSize: "4194304",
    mediaGallery: {
      initialOpenSubpath: "wysiwyg",
      openDialogTitle: (0, _translate)("Insert Images..."),
      openDialogUrl: "/admin/cms/wysiwyg_images/index/",
      storeId: "1"
    },
    template: "Magento_PageBuilder/form/element/stage/preview/uploader/image",
    uploaderConfig: {
      url: "/admin/pagebuilder/contenttype/image_upload/"
    },
    validation: {
      "required-entry": true
    }
  };
  return Uploader;
});
//# sourceMappingURL=uploader.js.map
