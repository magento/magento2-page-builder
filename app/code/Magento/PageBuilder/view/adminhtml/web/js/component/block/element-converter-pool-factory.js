/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./element-converter-pool", "../config"], function (_loader, _elementConverterPool, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of element converter pool
   */
  function create(contentType) {
    return new Promise(function (resolve) {
      var styleMapperCodes = [];
      var styleMappers = [];
      var styleMapperPreviewCodes = [];
      var styleMappersPreview = [];
      var attributeMapperCodes = [];
      var attributeMappers = [];

      var config = _config.getInitConfig("content_types")[contentType];

      for (var el in config.data_mapping.elements) {
        if (config.data_mapping.elements[el].style !== undefined) {
          for (var i = 0; i < config.data_mapping.elements[el].style.length; i++) {
            var styleProperty = config.data_mapping.elements[el].style[i];

            if (styleProperty.converter !== '' && styleProperty.converter !== null || styleProperty.preview_converter !== '' && styleProperty.preview_converter !== null) {
              var mapper = styleProperty.converter !== '' && styleProperty.converter !== null ? styleProperty.converter : null;
              styleMapperCodes.push(styleProperty.var + styleProperty.name);
              styleMappers.push(mapper);
              var mapperPreview = styleProperty.preview_converter !== '' && styleProperty.preview_converter !== null ? styleProperty.preview_converter : mapper ? mapper : null;
              styleMapperPreviewCodes.push(styleProperty.var + styleProperty.name);
              styleMappersPreview.push(mapperPreview);
            }
          }
        }

        if (config.data_mapping.elements[el].attributes !== undefined) {
          for (var _i = 0; _i < config.data_mapping.elements[el].attributes.length; _i++) {
            var attribute = config.data_mapping.elements[el].attributes[_i];

            if (attribute.converter !== '' && attribute.converter !== null) {
              attributeMapperCodes.push(attribute.var + attribute.name);
              attributeMappers.push(attribute.converter);
            }
          }
        }
      }

      var styleMappersLoadedPromise = new Promise(function (resolve) {
        (0, _loader)(styleMappers, function () {
          var result = {};

          for (var _len = arguments.length, styleMappersLoaded = new Array(_len), _key = 0; _key < _len; _key++) {
            styleMappersLoaded[_key] = arguments[_key];
          }

          for (var _i2 = 0; _i2 < styleMapperCodes.length; _i2++) {
            result[styleMapperCodes[_i2]] = new styleMappersLoaded[_i2]();
          }

          resolve(result);
        });
      });
      var styleMappersPreviewLoadedPromise = new Promise(function (resolve) {
        (0, _loader)(styleMappersPreview, function () {
          var result = {};

          for (var _len2 = arguments.length, styleMappersPreviewLoaded = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            styleMappersPreviewLoaded[_key2] = arguments[_key2];
          }

          for (var _i3 = 0; _i3 < styleMapperPreviewCodes.length; _i3++) {
            result[styleMapperPreviewCodes[_i3]] = new styleMappersPreviewLoaded[_i3]();
          }

          resolve(result);
        });
      });
      var attributeMappersLoadedPromise = new Promise(function (resolve) {
        (0, _loader)(attributeMappers, function () {
          var result = {};

          for (var _len3 = arguments.length, attributeMappersLoaded = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            attributeMappersLoaded[_key3] = arguments[_key3];
          }

          for (var _i4 = 0; _i4 < attributeMapperCodes.length; _i4++) {
            result[attributeMapperCodes[_i4]] = new attributeMappersLoaded[_i4]();
          }

          resolve(result);
        });
      });
      var meppersLoaded = [];
      meppersLoaded.push(styleMappersLoadedPromise);
      meppersLoaded.push(styleMappersPreviewLoadedPromise);
      meppersLoaded.push(attributeMappersLoadedPromise);
      Promise.all(meppersLoaded).then(function (loadedMappers) {
        var styleMappers = loadedMappers[0],
            styleMappersPreview = loadedMappers[1],
            attributeMappers = loadedMappers[2];
        resolve(new _elementConverterPool(styleMappers, styleMappersPreview, attributeMappers));
      }).catch(function (error) {
        console.error(error);
      });
    });
  }

  return create;
});
//# sourceMappingURL=element-converter-pool-factory.js.map
