/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/utils/loader", "underscore", "Magento_PageBuilder/js/content-type/master-factory", "Magento_PageBuilder/js/content-type/preview-factory"], function (_events, _loader, _underscore, _masterFactory, _previewFactory) {
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
   * @api
   */
  function createContentType(config, parent, stageId, data, childrenLength) {
    if (data === void 0) {
      data = {};
    }

    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    return new Promise(function (resolve) {
      (0, _loader)([config.component], function (contentTypeComponent) {
        var contentType = new contentTypeComponent(parent, config, stageId);
        Promise.all([(0, _previewFactory)(contentType, config), (0, _masterFactory)(contentType, config)]).then(function (_ref) {
          var previewComponent = _ref[0],
              masterComponent = _ref[1];
          contentType.preview = previewComponent;
          contentType.content = masterComponent;
          contentType.dataStore.update(prepareData(config, data));
          resolve(contentType);
        });
      });
    }).then(function (contentType) {
      _events.trigger("contentType:createAfter", {
        id: contentType.id,
        contentType: contentType
      });

      _events.trigger(config.name + ":createAfter", {
        id: contentType.id,
        contentType: contentType
      });

      fireContentTypeReadyEvent(contentType, childrenLength);
      return contentType;
    }).catch(function (error) {
      console.error(error);
      return null;
    });
  }
  /**
   * Merge defaults and content type data
   *
   * @param {ContentTypeConfigInterface} config
   * @param {object} data
   * @returns {any}
   */


  function prepareData(config, data) {
    var defaults = {
      display: true
    };

    if (config.fields) {
      _underscore.each(config.fields, function (field, key) {
        defaults[key] = field.default;
      });
    }

    return _underscore.extend(defaults, data, {
      name: config.name
    });
  }
  /**
   * A content type is ready once all of its children have mounted
   *
   * @param {ContentType} contentType
   * @param {number} childrenLength
   */


  function fireContentTypeReadyEvent(contentType, childrenLength) {
    var fire = function fire() {
      var params = {
        id: contentType.id,
        contentType: contentType,
        expectChildren: childrenLength
      };

      _events.trigger("contentType:mountAfter", params);

      _events.trigger(contentType.config.name + ":mountAfter", params);
    };

    if (childrenLength === 0) {
      fire();
    } else {
      var mountCounter = 0;

      _events.on("contentType:mountAfter", function (args) {
        if (args.contentType.parent.id === contentType.id) {
          mountCounter++;

          if (mountCounter === childrenLength) {
            mountCounter = 0;
            fire();

            _events.off("contentType:" + contentType.id + ":mountAfter");
          }
        }
      }, "contentType:" + contentType.id + ":mountAfter");
    }
  }

  return _extends(createContentType, {
    __esModule: true
  });
});
//# sourceMappingURL=content-type-factory.js.map
