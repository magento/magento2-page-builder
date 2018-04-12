/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/block/data-converter-pool-factory", "Magento_PageBuilder/js/component/block/element-converter-pool-factory", "Magento_PageBuilder/js/preview-builder", "Magento_PageBuilder/js/content-builder"], function (_loader, _eventBus, _dataConverterPoolFactory, _elementConverterPoolFactory, _previewBuilder, _contentBuilder) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new content type instance
   *
   * @param {ContentTypeConfigInterface} config
   * @param {ContentTypeInterface} parent
   * @param {number} stageId
   * @param {object} data
   * @param {number} childrenLength
   * @returns {Promise<ContentTypeInterface>}
   */
  function createBlock(config, parent, stageId, data, childrenLength) {
    if (data === void 0) {
      data = {};
    }

    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    var promises = [(0, _elementConverterPoolFactory)(config.name), (0, _dataConverterPoolFactory)(config.name)];
    var contentBuilder = new _contentBuilder();
    var previewBuilder = new _previewBuilder();
    return new Promise(function (resolve) {
      Promise.all(promises).then(function (resolvedPromises) {
        var elementConverterPool = resolvedPromises[0],
            dataConverterPool = resolvedPromises[1];
        var componentPaths = [config.component, config.preview_component, config.content_component];
        (0, _loader)(componentPaths, function () {
          for (var _len = arguments.length, loadedComponents = new Array(_len), _key = 0; _key < _len; _key++) {
            loadedComponents[_key] = arguments[_key];
          }

          var ContentTypeComponent = loadedComponents[0],
              PreviewComponent = loadedComponents[1],
              ContentComponent = loadedComponents[2];
          previewBuilder.setElementDataConverter(elementConverterPool).setDataConverter(dataConverterPool).setConfig(config).setClassInstance(PreviewComponent);
          contentBuilder.setElementDataConverter(elementConverterPool).setDataConverter(dataConverterPool).setClassInstance(ContentComponent);
          resolve(new ContentTypeComponent(parent, config, stageId, prepareData(config, data), previewBuilder, contentBuilder));
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
  /**
   * Merge defaults and content type data
   *
   * @param {Config} config
   * @param {object} data
   * @returns {any}
   */


  function prepareData(config, data) {
    var defaults = {};

    if (config.fields) {
      _.each(config.fields, function (field, key) {
        defaults[key] = field.default;
      });
    }

    return _.extend(defaults, data);
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

  return createBlock;
});
//# sourceMappingURL=factory.js.map
