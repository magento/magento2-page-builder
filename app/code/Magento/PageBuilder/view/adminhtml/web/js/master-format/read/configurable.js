/*eslint-disable */
define(["mageUtils", "Magento_PageBuilder/js/content-type/appearance-config", "Magento_PageBuilder/js/converter/converter-pool-factory", "Magento_PageBuilder/js/mass-converter/converter-pool-factory", "Magento_PageBuilder/js/property/property-reader-pool-factory", "Magento_PageBuilder/js/utils/string"], function (_mageUtils, _appearanceConfig, _converterPoolFactory, _converterPoolFactory2, _propertyReaderPoolFactory, _string) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var Configurable =
  /*#__PURE__*/
  function () {
    function Configurable() {}

    var _proto = Configurable.prototype;

    /**
     * Read data from the dom based on configuration
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var _this = this;

      var role = element.getAttribute("data-role");
      var config = (0, _appearanceConfig)(role, element.getAttribute("data-appearance")).data_mapping;
      var componentsPromise = [(0, _propertyReaderPoolFactory)(role), (0, _converterPoolFactory)(role), (0, _converterPoolFactory2)(role)];
      return new Promise(function (resolve) {
        Promise.all(componentsPromise).then(function (loadedComponents) {
          var propertyReaderPool = loadedComponents[0],
              converterPool = loadedComponents[1],
              massConverterPool = loadedComponents[2];
          var data = {};

          var _arr = Object.keys(config.elements);

          for (var _i = 0; _i < _arr.length; _i++) {
            var elementName = _arr[_i];
            var elementConfig = config.elements[elementName]; // Do not read if path is optional

            console.log(elementConfig);

            if (elementConfig.path !== "") {
              console.log("path");
              var xpathResult = document.evaluate(elementConfig.path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
              var currentElement = xpathResult.singleNodeValue;

              if (currentElement === null || currentElement === undefined) {
                continue;
              }

              if (elementConfig.style.length) {
                data = _this.readStyle(elementConfig.style, currentElement, data, propertyReaderPool, converterPool);
              }

              if (elementConfig.attributes.length) {
                data = _this.readAttributes(elementConfig.attributes, currentElement, data, propertyReaderPool, converterPool);
              }

              if (undefined !== elementConfig.html.var) {
                data = _this.readHtml(elementConfig, currentElement, data, converterPool);
              }

              if (undefined !== elementConfig.tag.var) {
                data = _this.readHtmlTag(elementConfig, currentElement, data);
              }

              if (undefined !== elementConfig.css.var) {
                data = _this.readCss(elementConfig, currentElement, data);
              }
            } else {
              console.log("no path");
            }
          }

          data = _this.convertData(config, data, massConverterPool);
          resolve(data);
        }).catch(function (error) {
          console.error(error);
        });
      });
    };
    /**
     * Read attributes for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {PropertyReaderPool} propertyReaderPool
     * @param {ConverterPool} converterPool
     * @returns {object}
     */


    _proto.readAttributes = function readAttributes(config, element, data, propertyReaderPool, converterPool) {
      var result = {};

      for (var _iterator = config, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var _attributeConfig = _ref;

        if (true === !!_attributeConfig.virtual) {
          continue;
        }

        var value = !!_attributeConfig.complex ? propertyReaderPool.get(_attributeConfig.reader).read(element) : element.getAttribute(_attributeConfig.name);

        if (converterPool.get(_attributeConfig.converter)) {
          value = converterPool.get(_attributeConfig.converter).fromDom(value);
        }

        if (data[_attributeConfig.var] === "object") {
          value = _mageUtils.extend(value, data[_attributeConfig.var]);
        }

        result[_attributeConfig.var] = value;
      }

      return _.extend(data, result);
    };
    /**
     * Read style properties for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {PropertyReaderPool} propertyReaderPool
     * @param {ConverterPool} converterPool
     * @returns {object}
     */


    _proto.readStyle = function readStyle(config, element, data, propertyReaderPool, converterPool) {
      var result = _.extend({}, data);

      for (var _iterator2 = config, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i3 >= _iterator2.length) break;
          _ref2 = _iterator2[_i3++];
        } else {
          _i3 = _iterator2.next();
          if (_i3.done) break;
          _ref2 = _i3.value;
        }

        var _propertyConfig = _ref2;

        if (true === !!_propertyConfig.virtual) {
          continue;
        }

        var value = !!_propertyConfig.complex ? propertyReaderPool.get(_propertyConfig.reader).read(element) : element.style[(0, _string.fromSnakeToCamelCase)(_propertyConfig.name)];

        if (converterPool.get(_propertyConfig.converter)) {
          value = converterPool.get(_propertyConfig.converter).fromDom(value);
        }

        if (_typeof(result[_propertyConfig.var]) === "object") {
          value = _mageUtils.extend(result[_propertyConfig.var], value);
        }

        result[_propertyConfig.var] = value;
      }

      return result;
    };
    /**
     * Read element's tag
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */


    _proto.readHtmlTag = function readHtmlTag(config, element, data) {
      var result = {};
      result[config.tag.var] = element.nodeName.toLowerCase();
      return _.extend(data, result);
    };
    /**
     * Read element's css
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */


    _proto.readCss = function readCss(config, element, data) {
      var result = {};
      var css = element.getAttribute("class") !== null ? element.getAttribute("class") : "";

      if (config.css !== undefined && config.css.filter !== undefined && config.css.filter.length) {
        for (var _iterator3 = config.css.filter, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray3) {
            if (_i4 >= _iterator3.length) break;
            _ref3 = _iterator3[_i4++];
          } else {
            _i4 = _iterator3.next();
            if (_i4.done) break;
            _ref3 = _i4.value;
          }

          var _filterClass = _ref3;
          css = css.replace(_filterClass, "");
        }
      }

      result[config.css.var] = css.replace(/\s{2,}/g, " ").trim();
      return _.extend(data, result);
    };
    /**
     * Read element's content
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */


    _proto.readHtml = function readHtml(config, element, data, converterPool) {
      var result = {};
      var value = element.innerHTML;

      if (converterPool.get(config.html.converter)) {
        value = converterPool.get(config.html.converter).fromDom(value);
      }

      result[config.html.var] = value;
      return _.extend(data, result);
    };
    /**
     * Convert data after it's read for all elements
     *
     * @param {object} config
     * @param {object} data
     * @param {MassConverterPool} massConverterPool
     * @returns {object}
     */


    _proto.convertData = function convertData(config, data, massConverterPool) {
      for (var _iterator4 = config.converters, _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
          if (_i5 >= _iterator4.length) break;
          _ref4 = _iterator4[_i5++];
        } else {
          _i5 = _iterator4.next();
          if (_i5.done) break;
          _ref4 = _i5.value;
        }

        var _converterConfig = _ref4;

        if (massConverterPool.get(_converterConfig.component)) {
          data = massConverterPool.get(_converterConfig.component).fromDom(data, _converterConfig.config);
        }
      }

      return data;
    };

    return Configurable;
  }();

  return Configurable;
});
//# sourceMappingURL=configurable.js.map
