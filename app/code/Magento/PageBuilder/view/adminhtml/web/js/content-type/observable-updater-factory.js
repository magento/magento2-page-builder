/*eslint-disable */
define(["Magento_PageBuilder/js/converter/converter-pool-factory", "Magento_PageBuilder/js/mass-converter/converter-pool-factory", "Magento_PageBuilder/js/content-type/observable-updater", "Magento_PageBuilder/js/content-type/style-registry"], function (_converterPoolFactory, _converterPoolFactory2, _observableUpdater, _styleRegistry) {
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
  function create(config, converterResolver, stageId) {
    var promises = [(0, _converterPoolFactory)(config.name), (0, _converterPoolFactory2)(config.name)];
    return Promise.all(promises).then(function (resolvedPromises) {
      var converterPool = resolvedPromises[0],
          massConverterPool = resolvedPromises[1];
      return new _observableUpdater(converterPool, massConverterPool, converterResolver, (0, _styleRegistry.getStyleRegistryForStage)(stageId));
    }).catch(function (error) {
      console.error(error);
      return null;
    });
  }

  return create;
});
//# sourceMappingURL=observable-updater-factory.js.map