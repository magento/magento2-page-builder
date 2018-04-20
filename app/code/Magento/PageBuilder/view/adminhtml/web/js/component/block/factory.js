/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "uiEvents", "Magento_PageBuilder/js/component/block/data-converter-pool-factory", "Magento_PageBuilder/js/component/block/element-converter-pool-factory"], function (_loader, _uiEvents, _dataConverterPoolFactory, _elementConverterPoolFactory) {
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
   * A block is ready once all of its children have mounted
   *
   * @param {Block} block
   * @param {number} childrenLength
   */


  function fireBlockReadyEvent(block, childrenLength) {
    var fire = function fire() {
      _uiEvents.trigger("block:ready", {
        id: block.id,
        block: block
      });

      _uiEvents.trigger(block.config.name + ":block:ready", {
        id: block.id,
        block: block
      });
    };

    if (childrenLength === 0) {
      fire();
    } else {
      var mountCounter = 0;

      _uiEvents.on("block:mount", function (args) {
        if (args.block.parent.id === block.id) {
          mountCounter++;

          if (mountCounter === childrenLength) {
            fire();

            _uiEvents.off("block:mount:" + block.id);
          }
        }
      }, "block:mount:" + block.id);
    }
  }
  /**
   * Create a new instance of a block
   *
   * @param {ConfigContentBlock} config
   * @param {EditableArea} parent
   * @param {Stage} stage
   * @param {object} formData
   * @param {number} childrenLength
   * @returns {Promise<Block>}
   */


  function createBlock(config, parent, stage, formData, childrenLength) {
    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    stage = stage || parent.stage;
    formData = formData || {};
    var componentsPromise = [(0, _elementConverterPoolFactory)(config.name), (0, _dataConverterPoolFactory)(config.name)];
    return new Promise(function (resolve) {
      Promise.all(componentsPromise).then(function (loadedConverters) {
        var elementConverterPool = loadedConverters[0],
            dataConverterPool = loadedConverters[1];
        (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
          resolve(new blockComponent(parent, stage, config, formData, elementConverterPool, dataConverterPool));
        });
      }).catch(function (error) {
        console.error(error);
      });
    }).then(function (block) {
      _uiEvents.trigger("block:create", {
        id: block.id,
        block: block
      });

      _uiEvents.trigger(config.name + ":block:create", {
        id: block.id,
        block: block
      });

      fireBlockReadyEvent(block, childrenLength);
      return block;
    });
  }

  return createBlock;
});
//# sourceMappingURL=factory.js.map
