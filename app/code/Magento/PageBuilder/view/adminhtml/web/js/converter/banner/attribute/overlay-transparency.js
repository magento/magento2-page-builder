/*eslint-disable */
define(["../../../utils/extract-alpha-from-rgba"], function (_extractAlphaFromRgba) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayTransparency =
  /*#__PURE__*/
  function () {
    function OverlayTransparency() {}

    var _proto = OverlayTransparency.prototype;

    _proto.fromDom = function fromDom(value, key, data) {
      return value === "transparent" ? "0" : (0, _extractAlphaFromRgba)(value);
    };

    _proto.toDom = function toDom(value, key, data) {
      return value;
    };

    return OverlayTransparency;
  }();

  return OverlayTransparency;
});
//# sourceMappingURL=overlay-transparency.js.map
