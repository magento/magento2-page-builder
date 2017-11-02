define(["../config", "../block/preview/block", "Gene_BlueFoot/js/component/loader"], function (_config, _block, _loader) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var previews = [];
  /**
   * Load all preview instances into our cache
   */

  function load() {
    var contentBlocks = _config.getInitConfig("contentTypes");

    var blocksToLoad = [],
        blockCodes = []; // @todo should be string, but TS complains

    Object.keys(contentBlocks).forEach(function (blockKey) {
      var block = contentBlocks[blockKey];

      if (typeof block.preview_component === 'string') {
        blockCodes.push(blockKey);
        blocksToLoad.push(block.preview_component);
      }
    }); // @todo this could create a race condition loading these async upfront

    (0, _loader)(blocksToLoad, function () {
      for (var _len = arguments.length, blocks = new Array(_len), _key = 0; _key < _len; _key++) {
        blocks[_key] = arguments[_key];
      }

      for (var arg = 0; arg < blocks.length; ++arg) {
        previews[blockCodes[arg]] = blocks[arg];
      }
    });
  }
  /**
   * Get preview instance for a specific block
   *
   * @param {Block} block
   * @param blockConfig
   * @returns {PreviewBlock}
   */


  function get(block, blockConfig) {
    var code = blockConfig.name;
    var instance;

    if (typeof previews[code] === 'undefined') {
      instance = _block;
    } else {
      instance = previews[code];
    }

    return new instance(block, blockConfig);
  } // @todo move these into Config class


  return Object.assign(get, {
    load: load
  });
});
//# sourceMappingURL=previews.js.map
