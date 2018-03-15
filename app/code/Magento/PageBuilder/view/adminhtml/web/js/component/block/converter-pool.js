/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ConverterPool =
  /*#__PURE__*/
  function () {
    function ConverterPool(converters) {
      this.converters = void 0;
      this.converters = converters;
    }

    var _proto = ConverterPool.prototype;

    _proto.getConverters = function getConverters() {
      return this.converters;
    };

    return ConverterPool;
  }();

  return ConverterPool;
});
//# sourceMappingURL=converter-pool.js.map
