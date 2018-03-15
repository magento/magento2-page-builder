/*eslint-disable */
define(["Magento_PageBuilder/js/component/loader", "./converter-pool", "../config"], function (_loader, _converterPool, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create a new instance of converter pool
   */
  function create(contentType) {
    var config = _config.getInitConfig("content_types")[contentType];

    var converterCodes = [];
    var converters = [];

    if (config.data_mapping.converters !== undefined) {
      for (var i = 0; i < config.data_mapping.converters.length; i++) {
        var converter = config.data_mapping.converters[i];
        converterCodes.push(converter.name);
        converters.push(converter.component);
      }
    }

    return new Promise(function (resolve) {
      (0, _loader)(converters, function () {
        var result = {};

        for (var _len = arguments.length, loadedConverters = new Array(_len), _key = 0; _key < _len; _key++) {
          loadedConverters[_key] = arguments[_key];
        }

        for (var _i = 0; _i < converterCodes.length; _i++) {
          result[converterCodes[_i]] = new loadedConverters[_i]();
        }

        resolve(new _converterPool(result));
      });
    });
  }

  return create;
});
//# sourceMappingURL=converter-pool-factory.js.map
