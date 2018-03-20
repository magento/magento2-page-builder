/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PropertyPool =
  /*#__PURE__*/
  function () {
    function PropertyPool() {
      this.properties = {};
    }

    var _proto = PropertyPool.prototype;

    _proto.getProperty = function getProperty(name) {
      return this.properties[name] !== undefined ? this.properties[name] : false;
    };

    _proto.registerProperty = function registerProperty(name, property) {
      this.properties[name] = property;
    };

    return PropertyPool;
  }();

  var _default = new PropertyPool();

  return _default;
});
//# sourceMappingURL=property-pool.js.map
