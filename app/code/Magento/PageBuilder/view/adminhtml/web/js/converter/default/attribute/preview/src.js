/*eslint-disable */
define([], function () {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Src =
  /*#__PURE__*/
  function () {
    function Src() {}

    var _proto = Src.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return;
    };

    _proto.toDom = function toDom(value, key, data) {
      if (value && _typeof(value[0]) === "object") {
        return value[0].url;
      }

      return null;
    };

    return Src;
  }();

  return Src;
});
//# sourceMappingURL=src.js.map
