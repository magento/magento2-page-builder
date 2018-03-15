/*eslint-disable */
define(["../../config", "../../block/element-converter-pool-factory", "../../block/converter-pool-factory"], function (_config, _elementConverterPoolFactory, _converterPoolFactory) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var Configurable =
  /*#__PURE__*/
  function () {
    function Configurable() {}

    var _proto = Configurable.prototype;

    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var _this = this;

      var role = element.getAttribute('data-role');

      var contentTypeConfig = _config.getInitConfig("content_types")[role];

      var config = contentTypeConfig["data_mapping"];
      var appearance = element.getAttribute("data-appearance");

      if (appearance && contentTypeConfig["appearances"] !== undefined && contentTypeConfig["appearances"][appearance] !== undefined && contentTypeConfig["appearances"][appearance]["data_mapping"] !== undefined) {
        config = contentTypeConfig["appearances"][appearance]["data_mapping"];
      }

      var meppersLoaded = [];
      meppersLoaded.push((0, _elementConverterPoolFactory)(role));
      meppersLoaded.push((0, _converterPoolFactory)(role));
      return new Promise(function (resolve) {
        Promise.all(meppersLoaded).then(function (loadedMappers) {
          var elementConverterPool = loadedMappers[0],
              converterPool = loadedMappers[1];
          var data = {};

          for (var el in config.elements) {
            var xpathResult = document.evaluate(config.elements[el].path, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            var e = xpathResult.singleNodeValue;

            if (e === null || e === undefined) {
              continue;
            }

            if (config.elements[el].style !== undefined) {
              for (var i = 0; i < config.elements[el].style.length; i++) {
                var styleProperty = config.elements[el].style[i];

                if (true === !!styleProperty.virtual) {
                  continue;
                }

                var value = e.style[_this.fromSnakeToCamelCase(styleProperty.name)];

                var mapper = styleProperty.var + styleProperty.name;

                if (mapper in elementConverterPool.getStyleConverters()) {
                  value = elementConverterPool.getStyleConverters()[mapper].fromDom(value, styleProperty.name);
                }

                if (_typeof(data[styleProperty.var]) === "object") {
                  value = deepObjectExtend(data[styleProperty.var], value);
                }

                data[styleProperty.var] = value;
              }
            }

            if (config.elements[el].attributes !== undefined) {
              for (var _i = 0; _i < config.elements[el].attributes.length; _i++) {
                var attribute = config.elements[el].attributes[_i];

                var _value = e.getAttribute(attribute.name);

                var _mapper = attribute.var + attribute.name;

                if (_mapper in elementConverterPool.getAttributeConverters()) {
                  _value = elementConverterPool.getAttributeConverters()[_mapper].fromDom(_value);
                }

                if (data[attribute.var] === "object") {
                  _value = deepObjectExtend(_value, data[attribute.var]);
                }

                data[attribute.var] = _value;
              }
            }

            if (config.elements[el].html !== undefined) {
              data[config.elements[el].html.var] = e.innerHTML;
            }

            if (config.elements[el].tag !== undefined) {
              data[config.elements[el].tag.var] = e.nodeName.toLowerCase();
            }

            if (config.elements[el].css !== undefined) {
              var css = e.getAttribute("class") !== null ? e.getAttribute("class") : "";

              if (config.elements[el].css !== undefined && config.elements[el].css.filter !== undefined && config.elements[el].css.filter.length) {
                for (var _i2 = 0; _i2 < config.elements[el].css.filter.length; _i2++) {
                  css = css.replace(data[config.elements[el].css.filter[_i2]], "");
                }
              }

              data[config.elements[el].css.var] = css;
            }
          }

          for (var key in converterPool.getConverters()) {
            for (var _i3 = 0; _i3 < config.converters.length; _i3++) {
              if (config.converters[_i3].name === key) {
                data = converterPool.getConverters()[key].afterRead(data, config.converters[_i3].config);
              }
            }
          }

          console.log(data);
          resolve(data);
        }).catch(function (error) {
          console.error(error);
        });
      });
    };
    /**
     * Convert from snake case to camel case
     *
     * @param {string} string
     * @returns {string}
     */


    _proto.fromSnakeToCamelCase = function fromSnakeToCamelCase(currentString) {
      var parts = currentString.split(/[_-]/);
      var newString = "";

      for (var i = 1; i < parts.length; i++) {
        newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }

      return parts[0] + newString;
    };

    return Configurable;
  }();

  function deepObjectExtend(target, source) {
    for (var prop in source) {
      if (prop in target) {
        deepObjectExtend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }

    return target;
  }

  return Configurable;
});
//# sourceMappingURL=configurable.js.map
