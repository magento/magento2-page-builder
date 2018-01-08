/*eslint-disable */
define(["Gene_BlueFoot/js/component/loader", "../appearance/appearance-factory"], function (_loader, _appearanceFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';

  /**
   * Retrieve the block instance from the config object
   *
   * @param config
   * @returns {any|string}
   */
  function getBlockComponentPath(config) {
    return config.component || 'Gene_BlueFoot/js/component/block/block';
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
    var appearanceFactory = new _appearanceFactory();
    return new Promise(function (resolve, reject) {
      appearanceFactory.create(config).then(function (appearance) {
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          try {
            resolve(new blockComponent(parent, stage, config, formData, appearance));
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
