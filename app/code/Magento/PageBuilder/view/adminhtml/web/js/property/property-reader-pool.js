/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PropertyReaderPool =
  /*#__PURE__*/
  function () {
    function PropertyReaderPool() {
      this.propertyReaders = {};
    }

    var _proto = PropertyReaderPool.prototype;

    /**
     * Retrieve a property reader from the pool
     *
     * @param {string} name
     * @returns {PropertyReaderInterface}
     */
    _proto.get = function get(name) {
      return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : null;
    };
    /**
     * Register a new property reader into the pool
     *
     * @param {string} name
     * @param {PropertyReaderInterface} property
     */


    _proto.register = function register(name, property) {
      this.propertyReaders[name] = property;
    };

    return PropertyReaderPool;
  }();

  var _default = new PropertyReaderPool();

  return _extends(_default, {
    __esModule: true,
    PropertyReaderPool: PropertyReaderPool
  });
});
//# sourceMappingURL=property-reader-pool.js.map
