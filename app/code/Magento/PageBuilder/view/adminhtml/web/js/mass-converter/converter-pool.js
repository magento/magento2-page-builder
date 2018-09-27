/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var DataConverterPool =
  /*#__PURE__*/
  function () {
    function DataConverterPool() {
      this.converters = {};
    }

    var _proto = DataConverterPool.prototype;

    /**
     * Retrieve a data converter instance from the pool
     *
     * @param {string} name
     * @returns {ConverterInterface}
     */
    _proto.get = function get(name) {
      return this.converters[name] !== undefined ? this.converters[name] : null;
    };
    /**
     * Register a new data converter into the pool
     *
     * @param {string} name
     * @param {ConverterInterface} converter
     */


    _proto.register = function register(name, converter) {
      this.converters[name] = converter;
    };

    return DataConverterPool;
  }();

  var _default = new DataConverterPool();

  return Object.assign(_default, {
    __esModule: true
  });
});
//# sourceMappingURL=converter-pool.js.map
