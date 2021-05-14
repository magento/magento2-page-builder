/*eslint-disable */
/* jscs:disable */

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/property/property-reader-pool"], function (_config, _loader, _propertyReaderPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of property reader pool
   */
  function create(contentType) {
    var config = _config.getContentTypeConfig(contentType);

    var propertyReaders = [];
    var appearanceName;

    for (var _i = 0, _Object$keys = Object.keys(config.appearances); _i < _Object$keys.length; _i++) {
      appearanceName = _Object$keys[_i];
      var appearance = config.appearances[appearanceName];

      if (appearance !== undefined && appearance.elements !== undefined) {
        var elementName = void 0;

        for (var _i2 = 0, _Object$keys2 = Object.keys(appearance.elements); _i2 < _Object$keys2.length; _i2++) {
          elementName = _Object$keys2[_i2];
          var element = appearance.elements[elementName];

          if (element.style !== undefined) {
            for (var _iterator = _createForOfIteratorHelperLoose(element.style), _step; !(_step = _iterator()).done;) {
              var propertyConfig = _step.value;

              if (propertyConfig.reader && propertyReaders.indexOf(propertyConfig.reader) === -1 && !_propertyReaderPool.get(propertyConfig.reader)) {
                propertyReaders.push(propertyConfig.reader);
              }
            }
          }

          if (element.attributes !== undefined) {
            for (var _iterator2 = _createForOfIteratorHelperLoose(element.attributes), _step2; !(_step2 = _iterator2()).done;) {
              var attributeConfig = _step2.value;

              if (attributeConfig.reader && propertyReaders.indexOf(attributeConfig.reader) === -1 && !_propertyReaderPool.get(attributeConfig.reader)) {
                propertyReaders.push(attributeConfig.reader);
              }
            }
          }
        }
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(propertyReaders, function () {
        for (var _len = arguments.length, loadedPropertyReaders = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedPropertyReaders[_key] = arguments[_key];
        }

        for (var i = 0; i < propertyReaders.length; i++) {
          _propertyReaderPool.register(propertyReaders[i], new loadedPropertyReaders[i]());
        }

        resolve(_propertyReaderPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=property-reader-pool-factory.js.map