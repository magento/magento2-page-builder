/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonOpacity =
  /*#__PURE__*/
  function () {
    function ButtonOpacity() {}

    var _proto = ButtonOpacity.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return value;
    };

    _proto.toDom = function toDom(value, key, data) {
      return data.show_button === "always" ? "1" : "0";
    };

    return ButtonOpacity;
  }();

  return ButtonOpacity;
});
//# sourceMappingURL=button-opacity.js.map
