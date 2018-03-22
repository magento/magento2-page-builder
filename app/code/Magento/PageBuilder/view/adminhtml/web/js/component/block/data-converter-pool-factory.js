/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "../config", "./data-converter-pool"], function (_loader, _config, _dataConverterPool) {
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

    for (key in config.appearances) {
      var dataMapping = config.appearances[key].data_mapping;

      if (dataMapping !== undefined && dataMapping.converters !== undefined) {
        for (var i = 0; i < dataMapping.converters.length; i++) {
          var converter = dataMapping.converters[i];

          if (!!converter.component && !_dataConverterPool.get(converter.component)) {
            converters.push(converter.component);
          }
        }
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(converters, function () {
        for (var _len = arguments.length, loadedConverters = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedConverters[_key] = arguments[_key];
        }

        for (var _i = 0; _i < converters.length; _i++) {
          _dataConverterPool.register(converters[_i], new loadedConverters[_i]());
        }

        resolve(_dataConverterPool);
      });
    });
  }

  return create;
});
//# sourceMappingURL=data-converter-pool-factory.js.map
