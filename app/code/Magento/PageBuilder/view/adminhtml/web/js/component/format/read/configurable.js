/*eslint-disable */
define(["../../block/element-converter-pool-factory", "../../block/converter-pool-factory", "../../../utils/string", "../../../utils/array", "../../../component/block/appearance-config"], function (_elementConverterPoolFactory, _converterPoolFactory, _string, _array, _appearanceConfig) {
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

      var role = element.getAttribute('data-role');
      var config = (0, _appearanceConfig)(role, element.getAttribute("data-appearance")).data_mapping;
      var mappersLoaded = [(0, _elementConverterPoolFactory)(role), (0, _converterPoolFactory)(role)];
      return new Promise(function (resolve) {
        Promise.all(mappersLoaded).then(function (loadedMappers) {
          var elementConverterPool = loadedMappers[0],
              converterPool = loadedMappers[1];
          var data = {};

          for (var elementName in config.elements) {
            var xpathResult = document.evaluate(config.elements[elementName].path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var currentElement = xpathResult.singleNodeValue;

            if (currentElement === null || currentElement === undefined) {
              continue;
            }

            if (config.elements[elementName].style !== undefined) {
              data = _this.readStyle(config.elements[elementName].style, currentElement, data, elementConverterPool);
            }

            if (config.elements[elementName].attributes !== undefined) {
              data = _this.readAttributes(config.elements[elementName].attributes, currentElement, data, elementConverterPool);
            }

            if (config.elements[elementName].html !== undefined) {
              data = _this.readHtml(config.elements[elementName], currentElement, data);
            }

            if (config.elements[elementName].tag !== undefined) {
              data = _this.readHtmlTag(config.elements[elementName], currentElement, data);
            }

            if (config.elements[elementName].css !== undefined) {
              data = _this.readCss(config.elements[elementName], currentElement, data);
            }
          }

          data = _this.convertData(config, data, converterPool);
          resolve(data);
        }).catch(function (error) {
          console.error(error);
        });
      });
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
        for (var i = 0; i < config.css.filter.length; i++) {
          css = css.replace(data[config.css.filter[i]], "");
        }
      }

      result[config.css.var] = css;
      return _.extend(data, result);
    };
    /**
     * Read element's tag
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @returns {object}
     */


    _proto.readHtmlTag = function readHtmlTag(config, e, data) {
      var result = {};
      result[config.tag.var] = e.nodeName.toLowerCase();
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


    _proto.readHtml = function readHtml(config, element, data) {
      var result = {};
      result[config.html.var] = element.innerHTML;
      return _.extend(data, result);
    };
    /**
     * Read attributes for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */


    _proto.readAttributes = function readAttributes(config, element, data, elementConverterPool) {
      var result = {};

      for (var i = 0; i < config.length; i++) {
        var attribute = config[i];
        var value = element.getAttribute(attribute.name);
        var mapper = attribute.var + attribute.name;

        if (mapper in elementConverterPool.getAttributeConverters()) {
          value = elementConverterPool.getAttributeConverters()[mapper].fromDom(value);
        }

        if (data[attribute.var] === "object") {
          value = (0, _array.objectExtend)(value, data[attribute.var]);
        }

        result[attribute.var] = value;
      }

      return _.extend(data, result);
    };
    /**
     * Read style properties for element
     *
     * @param {object} config
     * @param {Node} element
     * @param {object} data
     * @param {ElementConverterPool} elementConverterPool
     * @returns {object}
     */


    _proto.readStyle = function readStyle(config, element, data, elementConverterPool) {
      var result = _.extend({}, data);

      for (var i = 0; i < config.length; i++) {
        var property = config[i];

        if (true === !!property.virtual) {
          continue;
        }

        var value = element.style[(0, _string.fromSnakeToCamelCase)(property.name)];
        var mapper = property.var + property.name;

        if (mapper in elementConverterPool.getStyleConverters()) {
          value = elementConverterPool.getStyleConverters()[mapper].fromDom(value, property.name);
        }

        if (_typeof(result[property.var]) === "object") {
          value = (0, _array.objectExtend)(result[property.var], value);
        }

        result[property.var] = value;
      }

      return result;
    };
    /**
     * Convert data after it's read for all elements
     *
     * @param {object} config
     * @param {object} data
     * @param {ConverterPool} converterPool
     * @returns {object}
     */


    _proto.convertData = function convertData(config, data, converterPool) {
      for (var key in converterPool.getConverters()) {
        for (var i = 0; i < config.converters.length; i++) {
          if (config.converters[i].name === key) {
            data = converterPool.getConverters()[key].afterRead(data, config.converters[i].config);
          }
        }
      }

      return data;
    };

    return Configurable;
  }();

  return Configurable;
});
//# sourceMappingURL=configurable.js.map
