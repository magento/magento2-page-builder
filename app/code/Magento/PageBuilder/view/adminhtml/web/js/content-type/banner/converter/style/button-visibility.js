/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonVisibility = /*#__PURE__*/function () {
    "use strict";

    function ButtonVisibility() {}

    var _proto = ButtonVisibility.prototype;

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
      return data.show_button === "always" ? "visible" : "hidden";
    };

    return ButtonVisibility;
  }();

  return ButtonVisibility;
});
//# sourceMappingURL=button-visibility.js.map