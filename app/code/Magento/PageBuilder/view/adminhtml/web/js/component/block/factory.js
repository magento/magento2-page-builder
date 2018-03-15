/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./element-converter-pool-factory", "./converter-pool-factory"], function (_loader, _elementConverterPoolFactory, _converterPoolFactory) {
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
    return new Promise(function (resolve) {
      var meppersLoaded = [];
      meppersLoaded.push((0, _elementConverterPoolFactory)(config.name));
      meppersLoaded.push((0, _converterPoolFactory)(config.name));
      Promise.all(meppersLoaded).then(function (loadedMappers) {
        var elementConverterPool = loadedMappers[0],
            converterPool = loadedMappers[1];
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          resolve(new blockComponent(parent, stage, config, formData, elementConverterPool, converterPool));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
