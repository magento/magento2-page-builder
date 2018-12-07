/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Subtract margin from max-width to fit inside parent container
   * Accepted values are in pixels. If no value is set by user, it's 100%
   *
   * @api
   */
  var MaxWidth =
  /*#__PURE__*/
  function () {
    "use strict";

    function MaxWidth() {}

    var _proto = MaxWidth.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value.indexOf("100%") !== -1) {
        return "";
      }

      return value.replace("px", "");
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      if (data[name] !== "") {
        return data[name] + "px";
      }

      if (data.margins_and_padding && data.margins_and_padding !== undefined) {
        var margins = data.margins_and_padding.margin || {};
        var marginLeft = margins.left ? parseInt(margins.left, 10) : 0;
        var marginRight = margins.right ? parseInt(margins.right, 10) : 0;
        return "calc(100% - " + (marginLeft + marginRight) + "px)";
      }

      return "100%";
    };

    return MaxWidth;
  }();

  return MaxWidth;
});
//# sourceMappingURL=max-width.js.map
