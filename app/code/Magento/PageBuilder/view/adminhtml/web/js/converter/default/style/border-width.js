/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BorderWidth =
  /*#__PURE__*/
  function () {
    function BorderWidth() {}

    var _proto = BorderWidth.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return value === "initial" ? "" : value.replace("px", "");
    };

    _proto.toDom = function toDom(value, key, data) {
      return value + "px";
    };

    return BorderWidth;
  }();

  return BorderWidth;
});
//# sourceMappingURL=border-width.js.map
