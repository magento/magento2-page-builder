/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "../config", "./element-converter-pool"], function (_loader, _config, _elementConverterPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of converter pool
   */
  function create(contentType) {
    var config = _config.getContentType(contentType);

    var converters = [];

    var _arr = Object.keys(config.appearances);

    for (var _i = 0; _i < _arr.length; _i++) {
      var appearanceName = _arr[_i];
      var dataMapping = config.appearances[appearanceName].data_mapping;

      if (dataMapping !== undefined && dataMapping.elements !== undefined) {
        var _arr2 = Object.keys(dataMapping.elements);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var elementName = _arr2[_i2];

          if (dataMapping.elements[elementName].style !== undefined) {
            for (var _iterator = dataMapping.elements[elementName].style, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
              var _ref;

              if (_isArray) {
                if (_i3 >= _iterator.length) break;
                _ref = _iterator[_i3++];
              } else {
                _i3 = _iterator.next();
                if (_i3.done) break;
                _ref = _i3.value;
              }

              var _propertyConfig = _ref;

              if (!!_propertyConfig.converter && converters.indexOf(_propertyConfig.converter) === -1 && !_elementConverterPool.get(_propertyConfig.converter)) {
                converters.push(_propertyConfig.converter);
              }

              if (!!_propertyConfig.preview_converter && converters.indexOf(_propertyConfig.preview_converter) === -1 && !_elementConverterPool.get(_propertyConfig.preview_converter)) {
                converters.push(_propertyConfig.preview_converter);
              }
            }
          }

          if (dataMapping.elements[elementName].attributes !== undefined) {
            for (var _iterator2 = dataMapping.elements[elementName].attributes, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
              var _ref2;

              if (_isArray2) {
                if (_i4 >= _iterator2.length) break;
                _ref2 = _iterator2[_i4++];
              } else {
                _i4 = _iterator2.next();
                if (_i4.done) break;
                _ref2 = _i4.value;
              }

              var _attributeConfig = _ref2;

              if (!!_attributeConfig.converter && converters.indexOf(_attributeConfig.converter) === -1 && !_elementConverterPool.get(_attributeConfig.converter)) {
                converters.push(_attributeConfig.converter);
              }

              if (!!_attributeConfig.preview_converter && converters.indexOf(_attributeConfig.preview_converter) === -1 && !_elementConverterPool.get(_attributeConfig.preview_converter)) {
                converters.push(_attributeConfig.preview_converter);
              }
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
          _elementConverterPool.register(converters[i], new loadedConverters[i]());
        }

        resolve(_elementConverterPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=element-converter-pool-factory.js.map
