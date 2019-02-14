/*eslint-disable */
define(["knockout", "underscore", "Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/utils/string", "Magento_PageBuilder/js/content-type/appearance-config"], function (_knockout, _underscore, _object, _string, _appearanceConfig) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ObservableUpdater =
  /*#__PURE__*/
  function () {
    "use strict";

    /**
     * @param {typeof ConverterPool} converterPool
     * @param {typeof MassConverterPool} massConverterPool
     * @param {(config: object) => string} converterResolver
     */
    function ObservableUpdater(converterPool, massConverterPool, converterResolver) {
      this.converterPool = converterPool;
      this.massConverterPool = massConverterPool;
      this.converterResolver = converterResolver;
    }
    /**
     * Generate our data.ELEMENT.style Knockout observable objects for use within master and preview formats.
     *
     * @param {Preview} viewModel
     * @param {DataObject} data
     */


    var _proto = ObservableUpdater.prototype;

    _proto.update = function update(viewModel, data) {
      var appearance = data && data.appearance !== undefined ? data.appearance : undefined;
      var appearanceConfiguration = (0, _appearanceConfig)(viewModel.contentType.config.name, appearance);

      if (undefined === appearanceConfiguration || undefined === appearanceConfiguration.elements) {
        return;
      }

      var config = appearanceConfiguration.elements;
      data = this.convertData(data, appearanceConfiguration.converters);

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

        if (config[elementName].style !== undefined) {
          var currentStyles = viewModel.data[elementName].style();
          var newStyles = this.convertStyle(config[elementName], data);

          if (currentStyles) {
            /**
             * If so we need to retrieve the previous styles applied to this element and create a new object
             * which forces all of these styles to be "false". Knockout doesn't clean existing styles when
             * applying new styles to an element. This resolves styles sticking around when they should be
             * removed.
             */
            var removeCurrentStyles = Object.keys(currentStyles).reduce(function (object, styleName) {
              var _Object$assign;

              return Object.assign(object, (_Object$assign = {}, _Object$assign[styleName] = "", _Object$assign));
            }, {});

            if (!_underscore.isEmpty(removeCurrentStyles)) {
              newStyles = _underscore.extend(removeCurrentStyles, newStyles);
            }
          }

          viewModel.data[elementName].style(newStyles);
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
            var css = (0, _object.get)(data, config[elementName].css.var);
            var newClasses = {};

            if (css && css.length > 0) {
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
    }
    /**
     * Process data for elements before its converted to knockout format
     *
     * @param {object} data
     * @param {ConverterInterface[]} convertersConfig
     * @returns {object}
     */
    ;

    _proto.convertData = function convertData(data, convertersConfig) {
      for (var _iterator = convertersConfig, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i3 >= _iterator.length) break;
          _ref = _iterator[_i3++];
        } else {
          _i3 = _iterator.next();
          if (_i3.done) break;
          _ref = _i3.value;
        }

        var converterConfig = _ref;
        data = this.massConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
      }

      return data;
    }
    /**
     * Convert attributes
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {object}
     */
    ;

    _proto.convertAttributes = function convertAttributes(config, data) {
      var result = {};

      for (var _iterator2 = config.attributes, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i4 >= _iterator2.length) break;
          _ref2 = _iterator2[_i4++];
        } else {
          _i4 = _iterator2.next();
          if (_i4.done) break;
          _ref2 = _i4.value;
        }

        var attributeConfig = _ref2;

        if ("read" === attributeConfig.persistence_mode) {
          continue;
        }

        var value = void 0;

        if (!!attributeConfig.static) {
          value = attributeConfig.value;
        } else {
          value = (0, _object.get)(data, attributeConfig.var);
        }

        var converter = this.converterResolver(attributeConfig);

        if (this.converterPool.get(converter)) {
          value = this.converterPool.get(converter).toDom(attributeConfig.var, data);
        }

        result[attributeConfig.name] = value;
      }

      return result;
    }
    /**
     * Convert style properties
     *
     * @param {object}config
     * @param {object}data
     * @returns {object}
     */
    ;

    _proto.convertStyle = function convertStyle(config, data) {
      var result = {};

      if (config.style) {
        for (var _iterator3 = config.style, _isArray3 = Array.isArray(_iterator3), _i5 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray3) {
            if (_i5 >= _iterator3.length) break;
            _ref3 = _iterator3[_i5++];
          } else {
            _i5 = _iterator3.next();
            if (_i5.done) break;
            _ref3 = _i5.value;
          }

          var propertyConfig = _ref3;

          if ("read" === propertyConfig.persistence_mode) {
            continue;
          }

          var value = void 0;

          if (!!propertyConfig.static) {
            value = propertyConfig.value;
          } else {
            value = (0, _object.get)(data, propertyConfig.var);
            var converter = this.converterResolver(propertyConfig);

            if (this.converterPool.get(converter)) {
              value = this.converterPool.get(converter).toDom(propertyConfig.var, data);
            }
          }

          if (typeof value === "object") {
            _underscore.extend(result, value);
          } else if (typeof value !== "undefined") {
            result[(0, _string.fromSnakeToCamelCase)(propertyConfig.name)] = value;
          }
        }
      }

      if (_underscore.isEmpty(result)) {
        return null;
      }

      return result;
    }
    /**
     * Convert html property
     *
     * @param {object} config
     * @param {DataObject} data
     * @returns {string}
     */
    ;

    _proto.convertHtml = function convertHtml(config, data) {
      var value = config.html.var ? (0, _object.get)(data, config.html.var, config.html.placeholder) : config.html.placeholder;
      var converter = this.converterResolver(config.html);

      if (this.converterPool.get(converter)) {
        value = this.converterPool.get(converter).toDom(config.html.var, data);
      } // if value is empty, use placeholder


      if (typeof value === "string" && !value.length && config.html.placeholder) {
        value = config.html.placeholder;
      }

      return value;
    };

    return ObservableUpdater;
  }();

  return ObservableUpdater;
});
//# sourceMappingURL=observable-updater.js.map