/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "../config", "./property-reader-pool"], function (_loader, _config, _propertyReaderPool) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of property reader pool
   */
  function create(contentType) {
    var config = _config.getContentType(contentType);

    var propertyReaders = [];

    for (key in config.appearances) {
      var dataMapping = config.appearances[key].data_mapping;

      if (dataMapping !== undefined && dataMapping.elements !== undefined) {
        for (var elementName in dataMapping.elements) {
          if (dataMapping.elements[elementName].style !== undefined) {
            for (var i = 0; i < dataMapping.elements[elementName].style.length; i++) {
              var styleProperty = dataMapping.elements[elementName].style[i];

              if (!!styleProperty.complex && styleProperty.reader && propertyReaders.indexOf(styleProperty.reader) === -1 && !_propertyReaderPool.get(styleProperty.reader)) {
                propertyReaders.push(styleProperty.reader);
              }
            }
          }

          if (dataMapping.elements[elementName].attributes !== undefined) {
            for (var _i = 0; _i < dataMapping.elements[elementName].attributes.length; _i++) {
              var attributeProperty = dataMapping.elements[elementName].attributes[_i];

              if (!!attributeProperty.complex && attributeProperty.reader && propertyReaders.indexOf(attributeProperty.reader) === -1 && !_propertyReaderPool.get(attributeProperty.reader)) {
                propertyReaders.push(attributeProperty.reader);
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

        for (var _i2 = 0; _i2 < propertyReaders.length; _i2++) {
          _propertyReaderPool.register(propertyReaders[_i2], new loadedPropertyReaders[_i2]());
        }

        resolve(_propertyReaderPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=property-reader-pool-factory.js.map
