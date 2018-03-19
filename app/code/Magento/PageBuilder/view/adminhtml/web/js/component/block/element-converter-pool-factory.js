/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./converter-pool", "./appearance-config"], function (_loader, _converterPool, _appearanceConfig) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of element converter pool
   */
  function create(contentType) {
    return new Promise(function (resolve) {
      var converters = [];
      var config = (0, _appearanceConfig)(contentType, undefined);

      if (config.data_mapping !== undefined && config.data_mapping.elements !== undefined) {
        for (var el in config.data_mapping.elements) {
          if (config.data_mapping.elements[el].style !== undefined) {
            for (var i = 0; i < config.data_mapping.elements[el].style.length; i++) {
              var styleProperty = config.data_mapping.elements[el].style[i];
              var converter = styleProperty.converter ? styleProperty.converter : null;

              if (converters.indexOf(converter) == -1 && !_converterPool.getConverter(converter)) {
                converters.push(converter);
              }

              var previewConverter = styleProperty.preview_converter ? styleProperty.preview_converter : null;

              if (converters.indexOf(previewConverter) == -1 && !_converterPool.getConverter(previewConverter)) {
                converters.push(previewConverter);
              }
            }
          }

          if (config.data_mapping.elements[el].attributes !== undefined) {
            for (var _i = 0; _i < config.data_mapping.elements[el].attributes.length; _i++) {
              var attributeProperty = config.data_mapping.elements[el].attributes[_i];

              var _converter = attributeProperty.converter ? attributeProperty.converter : null;

              if (converters.indexOf(_converter) == -1 && !_converterPool.getConverter(_converter)) {
                converters.push(_converter);
              }

              var _previewConverter = attributeProperty.preview_converter ? attributeProperty.preview_converter : null;

              if (converters.indexOf(_previewConverter) == -1 && !_converterPool.getConverter(_previewConverter)) {
                converters.push(_previewConverter);
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

          for (var _i2 = 0; _i2 < converters.length; _i2++) {
            _converterPool.registerConverter(converters[_i2], new loadedConverters[_i2]());
          }

          resolve(_converterPool);
        });
      });
    });
  }

  return create;
});
//# sourceMappingURL=element-converter-pool-factory.js.map
