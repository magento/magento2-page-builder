/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/content-type/converter-resolver", "Magento_PageBuilder/js/content-type/observable-updater-factory"], function (_loader, _converterResolver, _observableUpdaterFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new content instance
   *
   * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
   * @param {ContentTypeConfigInterface} config
   * @returns {Promise<ContentTypeInterface>}
   */
  function create(contentType, config) {
    return new Promise(function (resolve, reject) {
      (0, _observableUpdaterFactory)(config, _converterResolver).then(function (observableUpdater) {
        (0, _loader)([config.master_component], function (masterComponent) {
          try {
            var master = new masterComponent(contentType, observableUpdater);
            resolve(master);
          } catch (error) {
            reject("Error within master component (" + config.master_component + ") for " + config.name + ".");
            console.error(error);
          }
        }, function (error) {
          reject("Unable to load preview component (" + config.master_component + ") for " + config.name + ". Please " + "check preview component exists and content type configuration is correct.");
          console.error(error);
        });
      }).catch(function (error) {
        console.error(error);
        return null;
      });
    });
  }

  return create;
});
//# sourceMappingURL=master-factory.js.map