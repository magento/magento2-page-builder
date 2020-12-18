/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/master-factory", "Magento_PageBuilder/js/content-type/preview-factory", "Magento_PageBuilder/js/utils/loader"], function (_events, _underscore, _config, _masterFactory, _previewFactory, _loader) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create new content type
   *
   * @param {ContentTypeConfigInterface} config
   * @param {ContentTypeInterface} parentContentType
   * @param {string} stageId
   * @param {object} data
   * @param {number} childrenLength
   * * @param {object} viewportsData
   * @returns {Promise<ContentTypeInterface>}
   * @api
   */
  function createContentType(config, parentContentType, stageId, data, childrenLength, viewportsData) {
    if (data === void 0) {
      data = {};
    }

    if (childrenLength === void 0) {
      childrenLength = 0;
    }

    if (viewportsData === void 0) {
      viewportsData = {};
    }

    return new Promise(function (resolve, reject) {
      (0, _loader)([config.component], function (contentTypeComponent) {
        try {
          var _contentType = new contentTypeComponent(parentContentType, config, stageId);

          var viewFactory = _config.getMode() === "Preview" ? _previewFactory : _masterFactory;
          viewFactory(_contentType, config).then(function (viewComponent) {
            var viewName = _config.getMode() === "Preview" ? "preview" : "content"; // @ts-ignore

            _contentType[viewName] = viewComponent;
            assignDataToDataStores(_contentType, config, data, viewportsData);
            resolve(_contentType);
          }).catch(function (error) {
            reject(error);
          });
        } catch (error) {
          reject("Error within component (" + config.component + ") for " + config.name + ".");
          console.error(error);
        }
      }, function (error) {
        reject("Unable to load component (" + config.component + ") for " + config.name + ". Please check component exists" + " and content type configuration is correct.");
        console.error(error);
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

  function assignDataToDataStores(contentType, config, data, viewportsData) {
    var defaultData = prepareData(config, data);

    var currentViewport = _config.getConfig("viewport") || _config.getConfig("defaultViewport");

    _underscore.each(_config.getConfig("viewports"), function (viewport, name) {
      var viewportData = {};
      var breakpoint = config.breakpoints[name];
      var viewportConfig = breakpoint && breakpoint.fields ? _underscore.extend({}, breakpoint, {
        name: config.name
      }) : {};

      if (!_underscore.isEmpty(viewportConfig)) {
        viewportsData[name] = viewportsData[name] || {};
        viewportData = prepareData(viewportConfig, viewportsData[name]);
      }

      contentType.dataStores[name].setState(_underscore.extend({}, defaultData, viewportData));
    });

    contentType.setViewportDataToDataStore(currentViewport);
  }
  /**
   * Merge defaults and content type data
   *
   * @param {ContentTypeConfigInterface} config
   * @param {object} data
   * @returns {any}
   */


  function prepareData(config, data) {
    var appearance = data.appearance + "-appearance";
    var fields = config.fields[appearance] || config.fields.default;
    var defaults = prepareDefaults(fields || {}); // Set all content types to be displayed by default

    defaults.display = true;
    return _underscore.extend(defaults, data, {
      name: config.name
    });
  }
  /**
   * Prepare the default values for fields within the form
   *
   * @param {ConfigFieldInterface} fields
   * @returns {FieldDefaultsInterface}
   */


  function prepareDefaults(fields) {
    if (_underscore.isEmpty(fields)) {
      return {};
    }

    return _underscore.mapObject(fields, function (field) {
      if (!_underscore.isUndefined(field.default)) {
        return field.default;
      } else if (_underscore.isObject(field)) {
        return prepareDefaults(field);
      }
    });
  }
  /**
   * A content type is ready once all of its children have mounted
   *
   * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
   * @param {number} childrenLength
   */


  function fireContentTypeReadyEvent(contentType, childrenLength) {
    if (childrenLength === void 0) {
      childrenLength = 0;
    }

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
        if (args.contentType.parentContentType.id === contentType.id) {
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
  /**
   * @api
   */


  return createContentType;
});
//# sourceMappingURL=content-type-factory.js.map