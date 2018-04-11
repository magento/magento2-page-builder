/*eslint-disable */
define(["knockout", "underscore", "Magento_PageBuilder/js/utils/string", "Magento_PageBuilder/js/component/block/appearance-config"], function (_knockout, _underscore, _string, _appearanceConfig) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var Convert =
  /*#__PURE__*/
  function () {
    /**
     * @param elementConverterPool
     * @param dataConverterPool
     */
    function Convert(elementConverterPool, dataConverterPool) {
      this.elementConverterPool = void 0;
      this.dataConverterPool = void 0;
      this.elementConverterPool = elementConverterPool;
      this.dataConverterPool = dataConverterPool;
    }
    /**
     * Update preview observables after data changed in data store
     *
     * @param {object} data
     */


    var _proto = Convert.prototype;

    _proto.updatePreviewObservables = function updatePreviewObservables(viewModel, data, area) {
      var appearance = data && data.appearance !== undefined ? data.appearance : undefined;
      var appearanceConfiguration = (0, _appearanceConfig)(viewModel.parent.config.name, appearance);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.data_mapping || undefined === appearanceConfiguration.data_mapping.elements) {
        return;
      }

      var config = appearanceConfiguration.data_mapping.elements;

      var _arr = Object.keys(config);

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

        data = this.convertData(data, appearanceConfiguration.data_mapping.converters);

        if (config[elementName].style !== undefined) {
          viewModel.data[elementName].style(this.convertStyle(config[elementName], data, area));
        }

        if (config[elementName].attributes !== undefined) {
          viewModel.data[elementName].attributes(this.convertAttributes(config[elementName], data, area));
        }

        if (config[elementName].html !== undefined) {
          viewModel.data[elementName].html(this.convertHtml(config[elementName], data, area));
        }

        if (config[elementName].css !== undefined && config[elementName].css.var in data) {
          (function () {
            var css = data[config[elementName].css.var];
            var newClasses = {};

            if (css.length > 0) {
              css.toString().split(" ").map(function (value, index) {
                return newClasses[value] = true;
              });
            }

            var _arr2 = Object.keys(viewModel.data[elementName].css());

            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
              var className = _arr2[_i2];

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
     * @param {string} area
     * @returns {object}
     */


    _proto.convertAttributes = function convertAttributes(config, data, area) {
      var result = {};

      for (var _iterator = config.attributes, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i3 >= _iterator.length) break;
          _ref = _iterator[_i3++];
        } else {
          _i3 = _iterator.next();
          if (_i3.done) break;
          _ref = _i3.value;
        }

        var _attributeConfig = _ref;

        if (undefined !== _attributeConfig.persist && null !== _attributeConfig.persist && "false" === _attributeConfig.persist) {
          continue;
        }

        var value = data[_attributeConfig.var];
        var converter = "preview" === area && _attributeConfig.preview_converter ? _attributeConfig.preview_converter : _attributeConfig.converter;

        if (this.elementConverterPool.get(converter)) {
          value = this.elementConverterPool.get(converter).toDom(_attributeConfig.var, data);
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
     * @param {string} area
     * @returns {object}
     */


    _proto.convertStyle = function convertStyle(config, data, area) {
      var result = {};

      if (config.style) {
        for (var _iterator2 = config.style, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i4 >= _iterator2.length) break;
            _ref2 = _iterator2[_i4++];
          } else {
            _i4 = _iterator2.next();
            if (_i4.done) break;
            _ref2 = _i4.value;
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
            var converter = "preview" === area && _propertyConfig.preview_converter ? _propertyConfig.preview_converter : _propertyConfig.converter;

            if (this.elementConverterPool.get(converter)) {
              value = this.elementConverterPool.get(converter).toDom(_propertyConfig.var, data);
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
     * @param {string} area
     * @returns {string}
     */


    _proto.convertHtml = function convertHtml(config, data, area) {
      var value = data[config.html.var] || config.html.placeholder;
      var converter = "preview" === area && config.html.preview_converter ? config.html.preview_converter : config.html.converter;

      if (this.elementConverterPool.get(converter)) {
        value = this.elementConverterPool.get(converter).toDom(config.html.var, data);
      }

      return value;
    };
    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {Object} data
     * @param {Object} convertersConfig
     * @returns {Object}
     */


    _proto.convertData = function convertData(data, convertersConfig) {
      for (var _iterator3 = convertersConfig, _isArray3 = Array.isArray(_iterator3), _i5 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
          if (_i5 >= _iterator3.length) break;
          _ref3 = _iterator3[_i5++];
        } else {
          _i5 = _iterator3.next();
          if (_i5.done) break;
          _ref3 = _i5.value;
        }

        var _converterConfig = _ref3;
        data = this.dataConverterPool.get(_converterConfig.component).toDom(data, _converterConfig.config);
      }

      return data;
    };

    return Convert;
  }();

  return Convert;
});
//# sourceMappingURL=convert.js.map
