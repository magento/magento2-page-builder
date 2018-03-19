/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ConverterPool =
  /*#__PURE__*/
  function () {
    function ConverterPool() {
      this.converters = {};
    }

    var _proto = ConverterPool.prototype;

    _proto.getConverter = function getConverter(name) {
      return this.converters[name] !== undefined ? this.converters[name] : false;
    };

    _proto.registerConverter = function registerConverter(name, converter) {
      this.converters[name] = converter;
    };

    return ConverterPool;
  }();

  var _default = new ConverterPool();

  return _default;
});
//# sourceMappingURL=converter-pool.js.map
