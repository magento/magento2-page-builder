/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/converter/converter-pool"], function (_config, _loader, _converterPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of converter pool
   */
  function create(contentType) {
    var config = _config.getContentTypeConfig(contentType);

    var converters = [];
    var appearanceName;

    for (var _i = 0, _Object$keys = Object.keys(config.appearances); _i < _Object$keys.length; _i++) {
      appearanceName = _Object$keys[_i];
      var appearance = config.appearances[appearanceName];

      if (appearance !== undefined && appearance.elements !== undefined) {
        var elementName = void 0;

        for (var _i2 = 0, _Object$keys2 = Object.keys(appearance.elements); _i2 < _Object$keys2.length; _i2++) {
          elementName = _Object$keys2[_i2];

          if (appearance.elements[elementName].style !== undefined) {
            for (var _iterator = appearance.elements[elementName].style, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
              var _ref;

              if (_isArray) {
                if (_i3 >= _iterator.length) break;
                _ref = _iterator[_i3++];
              } else {
                _i3 = _iterator.next();
                if (_i3.done) break;
                _ref = _i3.value;
              }

              var propertyConfig = _ref;

              if (!!propertyConfig.converter && converters.indexOf(propertyConfig.converter) === -1 && !_converterPool.get(propertyConfig.converter)) {
                converters.push(propertyConfig.converter);
              }

              if (!!propertyConfig.preview_converter && converters.indexOf(propertyConfig.preview_converter) === -1 && !_converterPool.get(propertyConfig.preview_converter)) {
                converters.push(propertyConfig.preview_converter);
              }
            }
          }

          if (appearance.elements[elementName].attributes !== undefined) {
            for (var _iterator2 = appearance.elements[elementName].attributes, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
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

              if (!!attributeConfig.converter && converters.indexOf(attributeConfig.converter) === -1 && !_converterPool.get(attributeConfig.converter)) {
                converters.push(attributeConfig.converter);
              }

              if (!!attributeConfig.preview_converter && converters.indexOf(attributeConfig.preview_converter) === -1 && !_converterPool.get(attributeConfig.preview_converter)) {
                converters.push(attributeConfig.preview_converter);
              }
            }
          }

          if (appearance.elements[elementName].html !== undefined) {
            var htmlConfig = appearance.elements[elementName].html;

            if (!!htmlConfig.converter && converters.indexOf(htmlConfig.converter) === -1 && !_converterPool.get(htmlConfig.converter)) {
              converters.push(htmlConfig.converter);
            }

            if (!!htmlConfig.preview_converter && converters.indexOf(htmlConfig.preview_converter) === -1 && !_converterPool.get(htmlConfig.preview_converter)) {
              converters.push(htmlConfig.preview_converter);
            }
          }
        }
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(converters, function () {
        for (var _len = arguments.length, loadedConverters = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedConverters[_key] = arguments[_key];
        }

        for (var i = 0; i < converters.length; i++) {
          _converterPool.register(converters[i], new loadedConverters[i]());
        }

        resolve(_converterPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=converter-pool-factory.js.map