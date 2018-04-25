/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "uiEvents", "underscore", "Magento_PageBuilder/js/content-factory", "Magento_PageBuilder/js/preview-factory"], function (_loader, _uiEvents, _underscore, _contentFactory, _previewFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new content type
   *
   * @param {ContentTypeConfigInterface} config
   * @param {ContentTypeInterface} parent
   * @param {number} stageId
   * @param {object} data
   * @param {number} childrenLength
   * @returns {Promise<ContentTypeInterface>}
   */
  function createContentType(config, parent, stageId, data, childrenLength) {
    if (data === void 0) {
      data = {};
    }

    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    return new Promise(function (resolve) {
      (0, _loader)([config.component], function (ContentTypeComponent) {
        var contentType = new ContentTypeComponent(parent, config, stageId);
        Promise.all([(0, _previewFactory)(contentType, config), (0, _contentFactory)(contentType, config)]).then(function (resolvedPromises) {
          var previewComponent = resolvedPromises[0],
              contentComponent = resolvedPromises[1];
          contentType.preview = previewComponent;
          contentType.content = contentComponent;
          contentType.store.update(contentType.id, prepareData(config, data));
          resolve(contentType);
        });
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
    }).catch(function (error) {
      console.error(error);
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
      _underscore.each(config.fields, function (field, key) {
        defaults[key] = field.default;
      });
    }

    return _underscore.extend(defaults, data);
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

      var eventCallback = function eventCallback(event, params) {
        if (params.block.parent.id === block.id) {
          mountCounter++;

          if (mountCounter === childrenLength) {
            fire();

            _uiEvents.off("block:mount", eventCallback);
          }
        }
      };

      _uiEvents.on("block:mount", eventCallback);
    }
  }

  return createContentType;
});
//# sourceMappingURL=content-type-factory.js.map
