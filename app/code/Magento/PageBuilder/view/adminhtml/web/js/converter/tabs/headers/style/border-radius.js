/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BorderRadius =
  /*#__PURE__*/
  function () {
    function BorderRadius() {}

    var _proto = BorderRadius.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      var radius = parseInt(data.border_radius, 10);
      return radius + "px " + radius + "px 0px 0px";
    };

    return BorderRadius;
  }();

  return BorderRadius;
});
//# sourceMappingURL=border-radius.js.map
