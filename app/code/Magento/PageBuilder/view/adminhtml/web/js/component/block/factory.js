/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./converter-pool-factory"], function (_loader, _converterPoolFactory) {
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
      (0, _converterPoolFactory)(config.name).then(function (converterPool) {
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          resolve(new blockComponent(parent, stage, config, formData, converterPool));
        });
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
