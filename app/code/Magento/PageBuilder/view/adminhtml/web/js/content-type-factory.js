/*eslint-disable */
define(["events", "Magento_PageBuilder/js/loader", "underscore", "Magento_PageBuilder/js/content-type/master-factory", "Magento_PageBuilder/js/content-type/preview-factory"], function (_events, _loader, _underscore, _masterFactory, _previewFactory) {
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
        Promise.all([(0, _previewFactory)(contentType, config), (0, _masterFactory)(contentType, config)]).then(function (resolvedPromises) {
          var previewComponent = resolvedPromises[0],
              masterComponent = resolvedPromises[1];
          contentType.preview = previewComponent;
          contentType.content = masterComponent;
          contentType.dataStore.update(prepareData(config, data));
          resolve(contentType);
        });
      });
    }).then(function (contentType) {
      _events.trigger("contentType:create", {
        id: contentType.id,
        contentType: contentType
      });

      _events.trigger(config.name + ":contentType:create", {
        id: contentType.id,
        contentType: contentType
      });

      fireContentTypeReadyEvent(contentType, childrenLength);
      return contentType;
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
   * A content type is ready once all of its children have mounted
   *
   * @param {ContentType} contentType
   * @param {number} childrenLength
   */


  function fireContentTypeReadyEvent(contentType, childrenLength) {
    var fire = function fire() {
      _events.trigger("contentType:ready", {
        id: contentType.id,
        contentType: contentType
      });

      _events.trigger(contentType.config.name + ":contentType:ready", {
        id: contentType.id,
        contentType: contentType
      });
    };

    if (childrenLength === 0) {
      fire();
    } else {
      var mountCounter = 0;

      _events.on("contentType:mount", function (args) {
        if (args.contentType.parent.id === contentType.id) {
          mountCounter++;

          if (mountCounter === childrenLength) {
            fire();

            _events.off("contentType:mount:" + contentType.id);
          }
        }
      }, "contentType:mount:" + contentType.id);
    }
  }

  return createContentType;
});
//# sourceMappingURL=content-type-factory.js.map
