/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config", "Magento_PageBuilder/js/utils/loader", "Magento_PageBuilder/js/mass-converter/converter-pool"], function (_config, _loader, _converterPool) {
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

      if (undefined !== appearance && undefined !== appearance.converters) {
        for (var _iterator = appearance.converters, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i2 >= _iterator.length) break;
            _ref = _iterator[_i2++];
          } else {
            _i2 = _iterator.next();
            if (_i2.done) break;
            _ref = _i2.value;
          }

          var converterConfig = _ref;

          if (!!converterConfig.component && !_converterPool.get(converterConfig.component)) {
            converters.push(converterConfig.component);
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