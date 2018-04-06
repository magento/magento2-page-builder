/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MarginBottom =
  /*#__PURE__*/
  function () {
    function MarginBottom() {}

    var _proto = MarginBottom.prototype;

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
      return data.border_width === "1" ? "-2px" : "-" + Math.round(data.border_width * (4 / 3)) + "px";
    };

    return MarginBottom;
  }();

  return MarginBottom;
});
//# sourceMappingURL=margin-bottom.js.map
