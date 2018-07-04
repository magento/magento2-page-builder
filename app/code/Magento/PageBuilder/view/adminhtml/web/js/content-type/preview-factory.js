/*eslint-disable */
define(["Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/content-type/observable-updater-factory", "Magento_PageBuilder/js/content-type/preview-converter-resolver"], function (_loader, _observableUpdaterFactory, _previewConverterResolver) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new preview instance
   *
   * @param {ContentTypeInterface} contentType
   * @param {ContentTypeConfigInterface} config
   * @returns {Promise<ContentTypeInterface>}
   * @api
   */
  function create(contentType, config) {
    return new Promise(function (resolve) {
      (0, _observableUpdaterFactory)(config, _previewConverterResolver).then(function (observableUpdater) {
        (0, _loader)([config.preview_component], function (PreviewComponent) {
          resolve(new PreviewComponent(contentType, config, observableUpdater));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return create;
});
//# sourceMappingURL=preview-factory.js.map
