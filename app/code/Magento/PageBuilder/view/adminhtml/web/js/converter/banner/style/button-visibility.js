/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonVisibility =
  /*#__PURE__*/
  function () {
    function ButtonVisibility() {}

    var _proto = ButtonVisibility.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      return data.show_button === "always" ? "visible" : "hidden";
    };

    return ButtonVisibility;
  }();

  return ButtonVisibility;
});
//# sourceMappingURL=button-visibility.js.map
