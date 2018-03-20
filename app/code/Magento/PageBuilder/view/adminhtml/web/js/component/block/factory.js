/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./property-pool-factory", "./converter-pool-factory"], function (_loader, _propertyPoolFactory, _converterPoolFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Retrieve the block instance from the config object
   *
   * @param config
   * @returns {any|string}
   */
  function getBlockComponentPath(config) {
    return config.component || "Magento_PageBuilder/js/component/block/block";
  }
  /**
   * Create a new instance of a block
   *
   * @param config
   * @param parent
   * @param stage
   * @param formData
   * @returns {Promise<BlockInterface>}
   */


  function createBlock(config, parent, stage, formData) {
    stage = stage || parent.stage;
    formData = formData || {};
    var componentsPromise = [(0, _propertyPoolFactory)(config.name), (0, _converterPoolFactory)(config.name)];
    return new Promise(function (resolve) {
      Promise.all(componentsPromise).then(function (loadedComponents) {
        var propertyPool = loadedComponents[0],
            converterPool = loadedComponents[1];
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          resolve(new blockComponent(parent, stage, config, formData, propertyPool, converterPool));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
