/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "Magento_PageBuilder/js/component/event-bus"], function (_loader, _eventBus) {
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
      _eventBus.trigger("block:ready", {
        id: block.id,
        block: block
      });

      _eventBus.trigger(block.config.name + ":block:ready", {
        id: block.id,
        block: block
      });
    };

    if (childrenLength === 0) {
      fire();
    } else {
      var mountCounter = 0;

      var eventCallback = function eventCallback(event, params) {
        if (params.block.parent.id === block.id) {
          mountCounter++;

          if (mountCounter === childrenLength) {
            fire();

            _eventBus.off("block:mount", eventCallback);
          }
        }
      };

      _eventBus.on("block:mount", eventCallback);
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
    return new Promise(function (resolve) {
      (0, _loader)([getBlockComponentPath(config)], function (blockComponent) {
        resolve(new blockComponent(parent, stage, config, formData));
      });
    }).then(function (block) {
      _eventBus.trigger("block:create", {
        id: block.id,
        block: block
      });

      _eventBus.trigger(config.name + ":block:create", {
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
