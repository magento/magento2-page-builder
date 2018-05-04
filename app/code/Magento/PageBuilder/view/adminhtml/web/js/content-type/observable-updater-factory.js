/*eslint-disable */
define(["Magento_PageBuilder/js/converter/data-converter-pool-factory", "Magento_PageBuilder/js/converter/element-converter-pool-factory", "Magento_PageBuilder/js/content-type/observable-updater"], function (_dataConverterPoolFactory, _elementConverterPoolFactory, _observableUpdater) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new observable updater instance
   *
   * @param {ContentTypeConfigInterface} config
   * @param {Function} converterResolver
   * @returns {Promise<ObservableUpdater>}
   */
  function create(config, converterResolver) {
    var promises = [(0, _elementConverterPoolFactory)(config.name), (0, _dataConverterPoolFactory)(config.name)];
    return new Promise(function (resolve) {
      Promise.all(promises).then(function (resolvedPromises) {
        var elementConverterPool = resolvedPromises[0],
            dataConverterPool = resolvedPromises[1];
        resolve(new _observableUpdater(elementConverterPool, dataConverterPool, converterResolver));
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return create;
});
//# sourceMappingURL=observable-updater-factory.js.map
