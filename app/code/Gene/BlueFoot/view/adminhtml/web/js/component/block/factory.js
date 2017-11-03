define(["Gene_BlueFoot/js/component/loader", "../appearance/appearance-applier-factory"], function (_loader, _appearanceApplierFactory) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Retrieve the block instance from the config object
   *
   * @param config
   * @returns {any|string}
   */
  function getBlockComponentPath(config) {
    return config.js_block || 'Gene_BlueFoot/js/component/block/block';
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
    var appearanceApplierFactory = new _appearanceApplierFactory();
    return new Promise(function (resolve, reject) {
      appearanceApplierFactory.create(config).then(function (appearanceApplier) {
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          try {
            resolve(new blockComponent(parent, stage, config, formData, appearanceApplier));
          } catch (e) {
            reject(e);
          }
        });
      }).catch(function (e) {
        reject(e);
      });
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
