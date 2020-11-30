/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Subtract margin from width to ensure adjacent elements do not
   * move or resize when positive or negative margins are present
   *
   * @api
   */
  var Width =
  /*#__PURE__*/
  function () {
    "use strict";

    function Width() {}

    var _proto = Width.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value.indexOf("calc") !== -1) {
        return value.split("%")[0].split("(")[1] + "%";
      }

      return value;
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      if (data[name] && data[name] !== "") {
        var marginsAndPadding = data.margins_and_padding || {};
        var margins = marginsAndPadding.margin || "";
        var marginLeft = margins.left ? parseInt(margins.left, 10) : 0;
        var marginRight = margins.right ? parseInt(margins.right, 10) : 0;

        if (marginLeft === 0 && marginRight === 0) {
          return data[name].toString();
        }

        return "calc(" + data[name].toString() + " - " + (marginLeft + marginRight) + "px)";
      }
    };

    return Width;
  }();

  return Width;
});
//# sourceMappingURL=width.js.map