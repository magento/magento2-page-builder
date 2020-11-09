/*eslint-disable */
/* jscs:disable */
define(["jquery", "mageUtils", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/appearance-config", "Magento_PageBuilder/js/converter/converter-pool-factory", "Magento_PageBuilder/js/mass-converter/converter-pool-factory", "Magento_PageBuilder/js/property/property-reader-pool-factory"], function (_jquery, _mageUtils, _underscore, _config, _appearanceConfig, _converterPoolFactory, _converterPoolFactory2, _propertyReaderPoolFactory) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Configurable =
  /*#__PURE__*/
  function () {
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

        var attributeConfig = _ref;

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

        var propertyConfig = _ref2;

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

          var filterClass = _ref3;
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

        var converterConfig = _ref4;

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