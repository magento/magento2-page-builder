/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var RemovePx =
  /*#__PURE__*/
  function () {
    "use strict";

    function RemovePx() {}

    var _proto = RemovePx.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value.replace("px", "");
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
      if (data[name]) {
        return data[name] + "px";
      }
    };

    return RemovePx;
  }();

  return RemovePx;
});
//# sourceMappingURL=remove-px.js.map
