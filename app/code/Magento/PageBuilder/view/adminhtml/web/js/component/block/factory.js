/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/data-converter-pool-factory", "Magento_PageBuilder/js/component/block/element-converter-pool-factory", "Magento_PageBuilder/js/preview-builder", "Magento_PageBuilder/js/content-builder", "Magento_PageBuilder/js/content"], function (_loader, _eventBus, _dataConverterPoolFactory, _elementConverterPoolFactory, _previewBuilder, _contentBuilder, _content) {
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
    return config.component || "Magento_PageBuilder/js/content-type";
  }
  /**
   * Retrieve the block instance from the config object
   *
   * @param config
   * @returns {any|string}
   */


  function getPreviewBlockComponentPath(config) {
    return config.preview_component || "Magento_PageBuilder/js/component/block/preview/block";
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
   * @param stageId
   * @param {object} formData
   * @param {number} childrenLength
   * @returns {Promise<Block>}
   */


  function createBlock(config, parent, stageId, formData, childrenLength) {
    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    formData = formData || {};
    var componentsPromise = [(0, _elementConverterPoolFactory)(config.name), (0, _dataConverterPoolFactory)(config.name)];
    var contentBuilder = new _contentBuilder();
    var previewBuilder = new _previewBuilder();
    return new Promise(function (resolve) {
      Promise.all(componentsPromise).then(function (loadedConverters) {
        var elementConverterPool = loadedConverters[0],
            dataConverterPool = loadedConverters[1];
        (0, _loader)([getBlockComponentPath(config), getPreviewBlockComponentPath(config)], function () {
          for (var _len = arguments.length, blockComponents = new Array(_len), _key = 0; _key < _len; _key++) {
            blockComponents[_key] = arguments[_key];
          }

          var blockComponent = blockComponents[0],
              previewComponent = blockComponents[1];
          previewBuilder.setElementDataConverter(elementConverterPool).setDataConverter(dataConverterPool).setConfig(config).setClassInstance(previewComponent);
          contentBuilder.setElementDataConverter(elementConverterPool).setDataConverter(dataConverterPool).setClassInstance(_content);
          var defaults = {};

          if (config.fields) {
            _.each(config.fields, function (field, key) {
              defaults[key] = field.default;
            });
          }

          resolve(new blockComponent(parent, config, stageId, _.extend(defaults, formData), previewBuilder, contentBuilder));
        });
      }).catch(function (error) {
        console.error(error);
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
