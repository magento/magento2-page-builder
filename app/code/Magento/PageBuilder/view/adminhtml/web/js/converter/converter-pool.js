/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var ConverterPool =
  /*#__PURE__*/
  function () {
    function ConverterPool() {
      this.converters = {};
    }

    var _proto = ConverterPool.prototype;

    _proto.get = function get(name) {
      return this.converters[name] !== undefined ? this.converters[name] : false;
    };

    _proto.register = function register(name, converter) {
      this.converters[name] = converter;
    };

    return ConverterPool;
  }();

  var _default = new ConverterPool();

  return _default;
});
//# sourceMappingURL=converter-pool.js.map
