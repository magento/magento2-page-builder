/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./element-converter-pool", "./appearance-config"], function (_loader, _elementConverterPool, _appearanceConfig) {
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
      var attributeMapperPreviewCodes = [];
      var attributeMappersPreview = [];
      var config = (0, _appearanceConfig)(contentType, undefined);

      if (config.data_mapping !== undefined && config.data_mapping.elements !== undefined) {
        for (var el in config.data_mapping.elements) {
          if (config.data_mapping.elements[el].style !== undefined) {
            for (var i = 0; i < config.data_mapping.elements[el].style.length; i++) {
              var styleProperty = config.data_mapping.elements[el].style[i];

              if (styleProperty.converter !== "" && styleProperty.converter !== null || styleProperty.preview_converter !== "" && styleProperty.preview_converter !== null) {
                var mapper = styleProperty.converter !== "" && styleProperty.converter !== null ? styleProperty.converter : null;
                styleMapperCodes.push(styleProperty.var + styleProperty.name);
                styleMappers.push(mapper);
                var mapperPreview = styleProperty.preview_converter !== "" && styleProperty.preview_converter !== null ? styleProperty.preview_converter : mapper ? mapper : null;
                styleMapperPreviewCodes.push(styleProperty.var + styleProperty.name);
                styleMappersPreview.push(mapperPreview);
              }
            }
          }

          if (config.data_mapping.elements[el].attributes !== undefined) {
            for (var _i = 0; _i < config.data_mapping.elements[el].attributes.length; _i++) {
              var attributeProperty = config.data_mapping.elements[el].attributes[_i];

              if (attributeProperty.converter !== "" && attributeProperty.converter !== null || attributeProperty.preview_converter !== "" && attributeProperty.preview_converter !== null) {
                var _mapper = attributeProperty.converter !== "" && attributeProperty.converter !== null ? attributeProperty.converter : null;

                attributeMapperCodes.push(attributeProperty.var + attributeProperty.name);
                attributeMappers.push(_mapper);

                var _mapperPreview = attributeProperty.preview_converter !== "" && attributeProperty.preview_converter !== null ? attributeProperty.preview_converter : _mapper ? _mapper : null;

                attributeMapperPreviewCodes.push(attributeProperty.var + attributeProperty.name);
                attributeMappersPreview.push(_mapperPreview);
              }
            }
          }
        }
      }

      var mappersLoaded = [getConvertersLoadedPromise(styleMapperCodes, styleMappers), getConvertersLoadedPromise(styleMapperPreviewCodes, styleMappersPreview), getConvertersLoadedPromise(attributeMapperCodes, attributeMappers), getConvertersLoadedPromise(attributeMapperPreviewCodes, attributeMappersPreview)];
      Promise.all(mappersLoaded).then(function (loadedMappers) {
        var styleMappers = loadedMappers[0],
            styleMappersPreview = loadedMappers[1],
            attributeMappers = loadedMappers[2],
            attributeMappersPreview = loadedMappers[3];
        resolve(new _elementConverterPool(styleMappers, styleMappersPreview, attributeMappers, attributeMappersPreview));
      }).catch(function (error) {
        console.error(error);
      });
    });
  }
  /**
   * Get converters loaded promise
   *
   * @param converterCodes
   * @param converters
   * @returns {Promise<any>}
   */


  function getConvertersLoadedPromise(converterCodes, converters) {
    return new Promise(function (resolve) {
      (0, _loader)(converters, function () {
        var result = {};

        for (var _len = arguments.length, convertersLoaded = new Array(_len), _key = 0; _key < _len; _key++) {
          convertersLoaded[_key] = arguments[_key];
        }

        for (var i = 0; i < converterCodes.length; i++) {
          result[converterCodes[i]] = new convertersLoaded[i]();
        }

        resolve(result);
      });
    });
  }

  return create;
});
//# sourceMappingURL=element-converter-pool-factory.js.map
