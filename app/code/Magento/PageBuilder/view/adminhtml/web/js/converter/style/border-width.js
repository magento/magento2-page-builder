/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var BorderWidth =
  /*#__PURE__*/
  function () {
    "use strict";

    function BorderWidth() {}

    var _proto = BorderWidth.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "initial" ? "" : value.replace("px", "");
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      if (data[name]) {
        return data[name] + "px";
      }
    };

    return BorderWidth;
  }();

  return BorderWidth;
});
//# sourceMappingURL=border-width.js.map
