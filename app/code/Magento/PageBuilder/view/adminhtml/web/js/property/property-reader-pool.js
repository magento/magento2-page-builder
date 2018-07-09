/*eslint-disable */
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

    _proto.get = function get(name) {
      return this.propertyReaders[name] !== undefined ? this.propertyReaders[name] : false;
    };

    _proto.register = function register(name, property) {
      this.propertyReaders[name] = property;
    };

    return PropertyReaderPool;
  }();

  var _default = new PropertyReaderPool();

  return Object.assign(_default, {
    PropertyReaderPool: PropertyReaderPool
  });
});
//# sourceMappingURL=property-reader-pool.js.map
