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

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "transparent" ? "0" : (0, _extractAlphaFromRgba)(value);
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name];
    };

    return OverlayTransparency;
  }();

  return OverlayTransparency;
});
//# sourceMappingURL=overlay-transparency.js.map
