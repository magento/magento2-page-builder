/*eslint-disable */
define([], function () {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundImage =
  /*#__PURE__*/
  function () {
    function BackgroundImage() {}

    var _proto = BackgroundImage.prototype;

    _proto.toDom = function toDom(value, key, data) {
      if (value && _typeof(value[0]) === "object") {
        return "url(" + value[0].url + ")";
      }

      return null;
    };

    return BackgroundImage;
  }();

  return BackgroundImage;
});
//# sourceMappingURL=background-image.js.map
