/*eslint-disable */
define(["Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/property/property-reader-pool"], function (_loader, _config, _propertyReaderPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of property reader pool
   * @api
   */
  function create(contentType) {
    var config = _config.getContentTypeConfig(contentType);

    var propertyReaders = [];

    var _arr = Object.keys(config.appearances);

    for (var _i = 0; _i < _arr.length; _i++) {
      var appearanceName = _arr[_i];
      var dataMapping = config.appearances[appearanceName].data_mapping;

      if (dataMapping !== undefined && dataMapping.elements !== undefined) {
        var _arr2 = Object.keys(dataMapping.elements);

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var elementName = _arr2[_i2];
          var element = dataMapping.elements[elementName];

          if (element.style !== undefined) {
            for (var _iterator = element.style, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

              if (!!_propertyConfig.complex && _propertyConfig.reader && propertyReaders.indexOf(_propertyConfig.reader) === -1 && !_propertyReaderPool.get(_propertyConfig.reader)) {
                propertyReaders.push(_propertyConfig.reader);
              }
            }
          }

          if (element.attributes !== undefined) {
            for (var _iterator2 = element.attributes, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
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

              if (!!_attributeConfig.complex && _attributeConfig.reader && propertyReaders.indexOf(_attributeConfig.reader) === -1 && !_propertyReaderPool.get(_attributeConfig.reader)) {
                propertyReaders.push(_attributeConfig.reader);
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
