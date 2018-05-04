/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ElementConverterPool =
  /*#__PURE__*/
  function () {
    function ElementConverterPool() {
      this.converters = {};
    }

    var _proto = ElementConverterPool.prototype;

    _proto.get = function get(name) {
      return this.converters[name] !== undefined ? this.converters[name] : false;
    };

    _proto.register = function register(name, converter) {
      this.converters[name] = converter;
    };

    return ElementConverterPool;
  }();

  var _default = new ElementConverterPool();

  return _default;
});
//# sourceMappingURL=element-converter-pool.js.map
