/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(["jquery", "mageUtils", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/appearance-config", "Magento_PageBuilder/js/converter/converter-pool-factory", "Magento_PageBuilder/js/mass-converter/converter-pool-factory", "Magento_PageBuilder/js/property/property-reader-pool-factory"], function (_jquery, _mageUtils, _underscore, _config, _appearanceConfig, _converterPoolFactory, _converterPoolFactory2, _propertyReaderPoolFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Configurable = /*#__PURE__*/function () {
    "use strict";

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

      var role = element.getAttribute(_config.getConfig("dataContentTypeAttributeName"));
      var config = (0, _appearanceConfig)(role, element.getAttribute("data-appearance"));
      var componentsPromise = [(0, _propertyReaderPoolFactory)(role), (0, _converterPoolFactory)(role), (0, _converterPoolFactory2)(role)];
      return new Promise(function (resolve) {
        Promise.all(componentsPromise).then(function (loadedComponents) {
          var propertyReaderPool = loadedComponents[0],
              converterPool = loadedComponents[1],
              massConverterPool = loadedComponents[2];

          var viewports = _config.getConfig("viewports");

          var data = {};

          _underscore.each(viewports, function (viewport, name) {
            return data[name] = {};
          });

          var _loop = function _loop() {
            var elementName = _Object$keys[_i];
            var elementConfig = config.elements[elementName];

            var currentElement = _this.findElementByName(element, elementName); // If we cannot locate the current element skip trying to read any attributes from it


            if (currentElement === null || currentElement === undefined) {
              return "continue";
            }

            _underscore.each(viewports, function (viewportObj, viewport) {
              currentElement.setAttribute("style", currentElement.getAttribute("data-" + viewport + "-style"));

              if (elementConfig.style.length) {
                data[viewport] = _this.readStyle(elementConfig.style, currentElement, data[viewport], propertyReaderPool, converterPool);
              }

              if (elementConfig.attributes.length) {
                data[viewport] = _this.readAttributes(elementConfig.attributes, currentElement, data[viewport], propertyReaderPool, converterPool);
              }

              if (undefined !== elementConfig.html.var) {
                data[viewport] = _this.readHtml(elementConfig, currentElement, data[viewport], converterPool);
              }

              if (undefined !== elementConfig.tag.var) {
                data[viewport] = _this.readHtmlTag(elementConfig, currentElement, data[viewport]);
              }

              if (undefined !== elementConfig.css.var) {
                data[viewport] = _this.readCss(elementConfig, currentElement, data[viewport]);
              }
            });
          };

          for (var _i = 0, _Object$keys = Object.keys(config.elements); _i < _Object$keys.length; _i++) {
            var _ret = _loop();

            if (_ret === "continue") continue;
          }

          _underscore.each(viewports, function (viewportObj, viewport) {
            data[viewport] = _this.convertData(config, data[viewport], massConverterPool);
          });

          resolve(data);
        }).catch(function (error) {
          console.error(error);
        });
      });
    }
    /**
     * Find the element for the current content type by it's name, avoiding searching in other content types by
     * removing any other element which contains it's own data-content-type.
     *
     * @param {HTMLElement} element
     * @param {string} name
     * @returns {HTMLElement}
     */
    ;

    _proto.findElementByName = function findElementByName(element, name) {
      // Create a clone of the element to avoid modifying the source
      var currentElement = (0, _jquery)(element).clone();

      if (currentElement.attr("data-element") === name) {
        return currentElement[0];
      } // Attempt to find the element in the children of the data-content-type


      var searchInChildren = currentElement.find("[data-element=\"" + name + "\"]"); // Ensure the element is within the current content type

      if (searchInChildren.length > 0 && searchInChildren.closest("[data-content-type]")[0] === currentElement[0]) {
        return searchInChildren[0];
      }

      return null;
    }
    /**
     * Read attributes for element
     *
     * @param {DataMappingAttributesInterface[]} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {any}
     */
    ;

    _proto.readAttributes = function readAttributes(config, element, data, propertyReaderPool, converterPool) {
      var result = {};

      for (var _iterator = _createForOfIteratorHelperLoose(config), _step; !(_step = _iterator()).done;) {
        var attributeConfig = _step.value;

        if ("write" === attributeConfig.persistence_mode) {
          continue;
        }

        var value = !!attributeConfig.static ? attributeConfig.value : propertyReaderPool.get(attributeConfig.reader).read(element, attributeConfig.name);

        if (converterPool.get(attributeConfig.converter)) {
          value = converterPool.get(attributeConfig.converter).fromDom(value);
        }

        if (_jquery.type(result[attributeConfig.var]) === "object") {
          var _mageUtils$extend;

          value = _mageUtils.extend((_mageUtils$extend = {}, _mageUtils$extend[attributeConfig.name] = value, _mageUtils$extend), result[attributeConfig.var]);
        }

        result[attributeConfig.var] = value;
      }

      return _underscore.extend(data, result);
    }
    /**
     * Read style properties for element
     *
     * @param {DataMappingStyleInterface[]} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof PropertyReaderPool} propertyReaderPool
     * @param {typeof ConverterPool} converterPool
     * @returns {{[p: string]: string}}
     */
    ;

    _proto.readStyle = function readStyle(config, element, data, propertyReaderPool, converterPool) {
      var result = _underscore.extend({}, data);

      for (var _iterator2 = _createForOfIteratorHelperLoose(config), _step2; !(_step2 = _iterator2()).done;) {
        var propertyConfig = _step2.value;

        if ("write" === propertyConfig.persistence_mode) {
          continue;
        }

        var value = !!propertyConfig.static ? propertyConfig.value : propertyReaderPool.get(propertyConfig.reader).read(element, propertyConfig.name);

        if (converterPool.get(propertyConfig.converter)) {
          value = converterPool.get(propertyConfig.converter).fromDom(value);
        }

        if (_jquery.type(result[propertyConfig.var]) === "object") {
          value = _mageUtils.extend(result[propertyConfig.var], value);
        }

        result[propertyConfig.var] = value;
      }

      return result;
    }
    /**
     * Read element's tag
     *
     * @param {object} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {object}
     */
    ;

    _proto.readHtmlTag = function readHtmlTag(config, element, data) {
      var result = {};
      result[config.tag.var] = element.nodeName.toLowerCase();
      return _underscore.extend(data, result);
    }
    /**
     * Read element's css
     *
     * @param {ContentTypeConfigAppearanceElementInterface} config
     * @param {HTMLElement} element
     * @param {object} data
     * @returns {any}
     */
    ;

    _proto.readCss = function readCss(config, element, data) {
      var result = {};
      var css = element.getAttribute("class") !== null ? element.getAttribute("class") : "";

      if (config.css !== undefined && config.css.filter !== undefined && config.css.filter.length) {
        for (var _iterator3 = _createForOfIteratorHelperLoose(config.css.filter), _step3; !(_step3 = _iterator3()).done;) {
          var filterClass = _step3.value;
          css = css.replace(filterClass, "");
        }
      }

      result[config.css.var] = css.replace(/\s{2,}/g, " ").trim();
      return _underscore.extend(data, result);
    }
    /**
     * Read element's content
     *
     * @param {ContentTypeConfigAppearanceElementInterface} config
     * @param {HTMLElement} element
     * @param {object} data
     * @param {typeof ConverterPool} converterPool
     * @returns {any}
     */
    ;

    _proto.readHtml = function readHtml(config, element, data, converterPool) {
      var result = {};
      var value = element.innerHTML;

      if (converterPool.get(config.html.converter)) {
        value = converterPool.get(config.html.converter).fromDom(value);
      }

      result[config.html.var] = value;
      return _underscore.extend(data, result);
    }
    /**
     * Convert data after it's read for all elements
     *
     * @param config
     * @param {object} data
     * @param {typeof MassConverterPool} massConverterPool
     * @returns {object}
     */
    ;

    _proto.convertData = function convertData(config, data, massConverterPool) {
      for (var _iterator4 = _createForOfIteratorHelperLoose(config.converters), _step4; !(_step4 = _iterator4()).done;) {
        var converterConfig = _step4.value;

        if (massConverterPool.get(converterConfig.component)) {
          data = massConverterPool.get(converterConfig.component).fromDom(data, converterConfig.config);
        }
      }

      return data;
    };

    return Configurable;
  }();

  return Configurable;
});
//# sourceMappingURL=configurable.js.map