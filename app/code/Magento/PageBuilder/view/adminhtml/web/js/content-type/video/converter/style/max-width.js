/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Subtract margin from max-width to fit inside parent container
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
      if (data.max_width !== "") {
        return data.max_width + "px";
      }

      var margins = data.margins_and_padding.margin || {};
      var marginLeft = margins.left ? parseInt(margins.left, 10) : 0;
      var marginRight = margins.right ? parseInt(margins.right, 10) : 0;
      return "calc(100% - " + (marginLeft + marginRight) + "px)";
    };

    return MaxWidth;
  }();

  return MaxWidth;
});
//# sourceMappingURL=max-width.js.map
