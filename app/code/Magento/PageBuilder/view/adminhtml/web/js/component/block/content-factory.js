/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "Magento_PageBuilder/js/converter-resolver", "Magento_PageBuilder/js/component/block/observable-updater-factory"], function (_loader, _converterResolver, _observableUpdaterFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new content instance
   *
   * @param {ContentTypeInterface} contentType
   * @param {ContentTypeConfigInterface} config
   * @returns {Promise<ContentTypeInterface>}
   */
  function create(contentType, config) {
    return new Promise(function (resolve) {
      (0, _observableUpdaterFactory)(config, _converterResolver).then(function (observableUpdater) {
        (0, _loader)([config.content_component], function (ContentComponent) {
          resolve(new ContentComponent(contentType, observableUpdater));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return create;
});
//# sourceMappingURL=content-factory.js.map
