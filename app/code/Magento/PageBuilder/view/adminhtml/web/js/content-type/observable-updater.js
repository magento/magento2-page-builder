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
      this.previousData = {};
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

      var generatedData = this.generate(appearanceConfiguration.elements, appearanceConfiguration.converters, data);

      var _loop = function _loop(element) {
        if (generatedData.hasOwnProperty(element)) {
          if (viewModel.data[element] === undefined) {
            viewModel.data[element] = {};
          }

          Object.keys(generatedData[element]).forEach(function (key) {
            if (viewModel.data[element][key] !== undefined && _knockout.isObservable(viewModel.data[element][key])) {
              viewModel.data[element][key](generatedData[element][key]);
            } else {
              viewModel.data[element][key] = _knockout.observable(generatedData[element][key]);
            }
          });
        }
      };

      for (var element in generatedData) {
        _loop(element);
      }
    }
    /**
     * Generate binding object to be applied to master format
     *
     * @param elements
     * @param converters
     * @param data
     */
    ;

    _proto.generate = function generate(elements, converters, data) {
      var convertedData = this.convertData(data, converters);
      var generatedData = {};

      var _arr = Object.keys(elements);

      for (var _i = 0; _i < _arr.length; _i++) {
        var elementName = _arr[_i];
        var elementConfig = elements[elementName];

        if (this.previousData[elementName] === undefined) {
          this.previousData[elementName] = {};
        }

        if (generatedData[elementName] === undefined) {
          generatedData[elementName] = {
            attributes: {},
            style: {},
            css: {},
            html: {}
          };
        }

        if (elementConfig.style !== undefined) {
          var previousStyles = {};

          if (this.previousData[elementName].style !== undefined) {
            previousStyles = this.previousData[elementName].style;
          }

          generatedData[elementName].style = this.generateStyles(previousStyles, elementConfig, convertedData);
          this.previousData[elementName].style = generatedData[elementName].style;
        }

        if (elementConfig.attributes !== undefined) {
          generatedData[elementName].attributes = this.generateAttributes(elementName, elementConfig, convertedData);
        }

        if (elementConfig.html !== undefined) {
          generatedData[elementName].html = this.convertHtml(elementConfig, convertedData);
        }

        if (elementConfig.css !== undefined && elementConfig.css.var in convertedData) {
          var previousCss = {};

          if (this.previousData[elementName].css !== undefined) {
            previousCss = this.previousData[elementName].css;
          }

          generatedData[elementName].css = this.generateCss(previousCss, elementConfig, convertedData);
          this.previousData[elementName].css = generatedData[elementName].css;
        }

        if (elementConfig.tag !== undefined && elementConfig.tag.var !== undefined) {
          if (generatedData[elementName][elementConfig.tag.var] === undefined) {
            generatedData[elementName][elementConfig.tag.var] = "";
          }

          generatedData[elementName][elementConfig.tag.var] = convertedData[elementConfig.tag.var];
        }
      }

      return generatedData;
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
      for (var _iterator = convertersConfig, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var converterConfig = _ref;
        data = this.massConverterPool.get(converterConfig.component).toDom(data, converterConfig.config);
      }

      return data;
    }
    /**
     * Generate style bindings for master format
     *
     * @param currentStyles
     * @param config
     * @param data
     */
    ;

    _proto.generateStyles = function generateStyles(currentStyles, config, data) {
      var newStyles = this.convertStyle(config, data);

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

      return newStyles;
    }
    /**
     * Generate attributes for master format
     *
     * @param elementName
     * @param config
     * @param data
     */
    ;

    _proto.generateAttributes = function generateAttributes(elementName, config, data) {
      var attributeData = this.convertAttributes(config, data);
      attributeData["data-element"] = elementName;
      return attributeData;
    }
    /**
     * Generate CSS bindings for master format
     *
     * @param currentCss
     * @param config
     * @param data
     */
    ;

    _proto.generateCss = function generateCss(currentCss, config, data) {
      var css = (0, _object.get)(data, config.css.var);
      var newClasses = {};

      if (css && css.length > 0) {
        css.toString().split(" ").map(function (value) {
          return newClasses[value] = true;
        });
      }

      var _arr2 = Object.keys(currentCss);

      for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
        var className = _arr2[_i3];

        if (!(className in newClasses)) {
          newClasses[className] = false;
        }
      }

      return newClasses;
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
          } else if (value !== undefined) {
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