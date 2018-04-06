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
      var borderRadius = "0";
      var radius = parseInt(data.border_radius, 10) || "0";
      var alignment = data.navigation_alignment.toLowerCase();

      if (data.border !== "_default") {
        if (alignment === "left") {
          borderRadius = "0px " + radius + "px " + radius + "px " + radius + "px";
        } else if (alignment === "center") {
          borderRadius = radius + "px";
        } else {
          borderRadius = radius + "px 0px " + radius + "px " + radius + "px";
        }
      }

      return borderRadius;
    };

    return BorderRadius;
  }();

  return BorderRadius;
});
//# sourceMappingURL=border-radius.js.map
