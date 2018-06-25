/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var DataConverterPool =
  /*#__PURE__*/
  function () {
    function DataConverterPool() {
      this.converters = {};
    }

    var _proto = DataConverterPool.prototype;

    _proto.get = function get(name) {
      return this.converters[name] !== undefined ? this.converters[name] : false;
    };

    _proto.register = function register(name, converter) {
      this.converters[name] = converter;
    };

    return DataConverterPool;
  }();

  var _default = new DataConverterPool();

  return _default;
});
//# sourceMappingURL=converter-pool.js.map
