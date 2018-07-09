/*eslint-disable */
define(["Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/content-type/converter-resolver", "Magento_PageBuilder/js/content-type/observable-updater-factory"], function (_loader, _converterResolver, _observableUpdaterFactory) {
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
   * @api
   */
  function create(contentType, config) {
    return new Promise(function (resolve) {
      (0, _observableUpdaterFactory)(config, _converterResolver).then(function (observableUpdater) {
        (0, _loader)([config.master_component], function (contentComponent) {
          resolve(new contentComponent(contentType, observableUpdater));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return create;
});
//# sourceMappingURL=master-factory.js.map
