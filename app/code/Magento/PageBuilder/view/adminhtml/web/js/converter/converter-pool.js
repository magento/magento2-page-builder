/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ConverterPool =
  /*#__PURE__*/
  function () {
    "use strict";

    function ConverterPool() {
      this.converters = {};
    }

    var _proto = ConverterPool.prototype;

    /**
     * Retrieve a converter from the pool
     *
     * @param {string} name
     * @returns {ConverterInterface}
     */
    _proto.get = function get(name) {
      return this.converters[name] !== undefined ? this.converters[name] : null;
    }
    /**
     * Register a new converter into the pool
     *
     * @param {string} name
     * @param {ConverterInterface} converter
     */
    ;

    _proto.register = function register(name, converter) {
      this.converters[name] = converter;
    };

    return ConverterPool;
  }();

  var _default = new ConverterPool();

  return _default;
});
//# sourceMappingURL=converter-pool.js.map