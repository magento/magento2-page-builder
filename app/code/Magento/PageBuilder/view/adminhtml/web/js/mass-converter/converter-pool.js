/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return _extends(_default, {
    __esModule: true
  });
});
//# sourceMappingURL=converter-pool.js.map
