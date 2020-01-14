/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonOpacity =
  /*#__PURE__*/
  function () {
    "use strict";

    function ButtonOpacity() {}

    var _proto = ButtonOpacity.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
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
      return data.show_button === "always" ? "1" : "0";
    };

    return ButtonOpacity;
  }();

  return ButtonOpacity;
});
//# sourceMappingURL=button-opacity.js.map