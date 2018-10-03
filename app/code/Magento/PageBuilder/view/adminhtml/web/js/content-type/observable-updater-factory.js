/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/converter/converter-pool-factory", "Magento_PageBuilder/js/mass-converter/converter-pool-factory", "Magento_PageBuilder/js/content-type/observable-updater"], function (_converterPoolFactory, _converterPoolFactory2, _observableUpdater) {
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
    var promises = [(0, _converterPoolFactory)(config.name), (0, _converterPoolFactory2)(config.name)];
    return new Promise(function (resolve) {
      Promise.all(promises).then(function (resolvedPromises) {
        var converterPool = resolvedPromises[0],
            massConverterPool = resolvedPromises[1];
        resolve(new _observableUpdater(converterPool, massConverterPool, converterResolver));
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return _extends(create, {
    __esModule: true
  });
});
//# sourceMappingURL=observable-updater-factory.js.map
