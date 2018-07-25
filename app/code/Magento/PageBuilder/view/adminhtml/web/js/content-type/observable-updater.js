/*eslint-disable */
define(["knockout", "underscore", "Magento_PageBuilder/js/utils/string", "Magento_PageBuilder/js/content-type/appearance-config"], function (_knockout, _underscore, _string, _appearanceConfig) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var ObservableUpdater =
  /*#__PURE__*/
  function () {
    /**
     * @param {typeof ConverterPool} converterPool
     * @param {typeof MassConverterPool} massConverterPool
     * @param {(config: object) => string} converterResolver
     */
    function ObservableUpdater(converterPool, massConverterPool, converterResolver) {
      this.converterPool = void 0;
      this.massConverterPool = void 0;
      this.converterResolver = void 0;
      this.converterPool = converterPool;
      this.massConverterPool = massConverterPool;
      this.converterResolver = converterResolver;
    }
    /**
     * Prepare a view model for preview data to be updated later
     *
     * @param {Preview} viewModel
     * @param {DataObject} data
     */


    var _proto = ObservableUpdater.prototype;

    _proto.prepare = function prepare(viewModel, data) {
      var appearanceConfiguration = this.getAppearanceConfig(viewModel, data);

      var _arr = Object.keys(appearanceConfiguration.data_mapping.elements);

      for (var _i = 0; _i < _arr.length; _i++) {
        var elementName = _arr[_i];

        if (viewModel.data[elementName] === undefined) {
          viewModel.data[elementName] = {
            attributes: _knockout.observable({}),
            style: _knockout.observable({}),
            css: _knockout.observable({}),
            html: _knockout.observable({})
          };
        }
      }
    };
    /**
     * Update preview observables after data changed in data store
     *
     * @param {Preview | Master} viewModel
     * @param {DataObject} data
     */


    _proto.update = function update(viewModel, data) {
      var appearanceConfiguration = this.getAppearanceConfig(viewModel, data);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.data_mapping || undefined === appearanceConfiguration.data_mapping.elements) {
        return;
      }

      var config = appearanceConfiguration.data_mapping.elements;

      var _arr2 = Object.keys(config);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var elementName = _arr2[_i2];

        if (viewModel.data[elementName] === undefined) {
          viewModel.data[elementName] = {
            attributes: _knockout.observable({}),
            style: _knockout.observable({}),
            css: _knockout.observable({}),
            html: _knockout.observable({})
          };
        }

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        if (config[elementName].style !== undefined) {
          viewModel.data[elementName].style(this.convertStyle(config[elementName], data));
        }

        if (config[elementName].attributes !== undefined) {
          var attributeData = this.convertAttributes(config[elementName], data);
          attributeData["data-element"] = elementName;
          viewModel.data[elementName].attributes(attributeData);
        }

        if (config[elementName].html !== undefined) {
          viewModel.data[elementName].html(this.convertHtml(config[elementName], data));
        }

        if (config[elementName].css !== undefined && config[elementName].css.var in data) {
          (function () {
            var css = data[config[elementName].css.var];
            var newClasses = {};

            if (css && css.length > 0) {
              css.toString().split(" ").map(function (value, index) {
                return newClasses[value] = true;
              });
            }

            var _arr3 = Object.keys(viewModel.data[elementName].css());

            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
              var className = _arr3[_i3];

              if (!(className in newClasses)) {
                newClasses[className] = false;
              }
            }

            viewModel.data[elementName].css(newClasses);
          })();
        }

        if (config[elementName].tag !== undefined) {
          if (viewModel.data[elementName][config[elementName].tag.var] === undefined) {
            viewModel.data[elementName][config[elementName].tag.var] = _knockout.observable("");
          }

          viewModel.data[elementName][config[elementName].tag.var](data[config[elementName].tag.var]);
        }
      }
    };
    /**
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {object}
     * @deprecated
     */


    _proto.convertAttributes = function convertAttributes(config, data) {
      var result = {};

      for (var _iterator = config.attributes, _isArray = Array.isArray(_iterator), _i4 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i4 >= _iterator.length) break;
          _ref = _iterator[_i4++];
        } else {
          _i4 = _iterator.next();
          if (_i4.done) break;
          _ref = _i4.value;
        }

        var _attributeConfig = _ref;

        if (undefined !== _attributeConfig.persist && null !== _attributeConfig.persist && "false" === _attributeConfig.persist) {
          continue;
        }

        var value = data[_attributeConfig.var];
        var converter = this.converterResolver(_attributeConfig);

        if (this.converterPool.get(converter)) {
          value = this.converterPool.get(converter).toDom(_attributeConfig.var, data);
        }

        result[_attributeConfig.name] = value;
      }

      return result;
    };
    /**
     * Convert style properties
     *
     * @param {object}config
     * @param {object}data
     * @returns {object}
     * @deprecated
     */


    _proto.convertStyle = function convertStyle(config, data) {
      var result = {};

      if (config.style) {
        for (var _iterator2 = config.style, _isArray2 = Array.isArray(_iterator2), _i5 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i5 >= _iterator2.length) break;
            _ref2 = _iterator2[_i5++];
          } else {
            _i5 = _iterator2.next();
            if (_i5.done) break;
            _ref2 = _i5.value;
          }

          var _propertyConfig = _ref2;

          if (undefined !== _propertyConfig.persist && null !== _propertyConfig.persist && "false" === _propertyConfig.persist) {
            continue;
          }

          var value = "";

          if (!!_propertyConfig.static) {
            value = _propertyConfig.value;
          } else {
            value = data[_propertyConfig.var];
            var converter = this.converterResolver(_propertyConfig);

            if (this.converterPool.get(converter)) {
              value = this.converterPool.get(converter).toDom(_propertyConfig.var, data);
            }
          }

          if (_typeof(value) === "object") {
            _underscore.extend(result, value);
          } else {
            result[(0, _string.fromSnakeToCamelCase)(_propertyConfig.name)] = value;
          }
        }
      }

      return result;
    };
    /**
     * Convert html property
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {string}
     * @deprecated
     */


    _proto.convertHtml = function convertHtml(config, data) {
      var value = data[config.html.var] || config.html.placeholder;
      var converter = this.converterResolver(config.html);

      if (this.converterPool.get(converter)) {
        value = this.converterPool.get(converter).toDom(config.html.var, data);
      } // if value is empty, use placeholder


      if (typeof value === "string" && !value.length && config.html.placeholder) {
        value = config.html.placeholder;
      }

      return value;
    };
    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {Object} data
     * @param {Object} convertersConfig
     * @returns {Object}
     * @deprecated
     */


    _proto.convertData = function convertData(data, convertersConfig) {
      for (var _iterator3 = convertersConfig, _isArray3 = Array.isArray(_iterator3), _i6 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i6 >= _iterator3.length) break;
          _ref3 = _iterator3[_i6++];
        } else {
          _i6 = _iterator3.next();
          if (_i6.done) break;
          _ref3 = _i6.value;
        }

        var _converterConfig = _ref3;
        data = this.massConverterPool.get(_converterConfig.component).toDom(data, _converterConfig.config);
      }

      return data;
    };
    /**
     * Retrieve the appearance config
     *
     * @param {Preview | Master} viewModel
     * @param {DataObject} data
     * @returns {ContentTypeConfigAppearanceInterface}
     */


    _proto.getAppearanceConfig = function getAppearanceConfig(viewModel, data) {
      var appearance = data && data.appearance !== undefined ? data.appearance.toString() : undefined;
      return (0, _appearanceConfig)(viewModel.parent.config.name, appearance);
    };

    return ObservableUpdater;
  }();

  return ObservableUpdater;
});
//# sourceMappingURL=observable-updater.js.map
