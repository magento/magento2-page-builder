/*eslint-disable */
define(["../../../utils/color-converter", "../../../utils/extract-alpha-from-rgba", "../../../utils/number-converter"], function (_colorConverter, _extractAlphaFromRgba, _numberConverter) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayColorTransparency =
  /*#__PURE__*/
  function () {
    function OverlayColorTransparency() {}

    var _proto = OverlayColorTransparency.prototype;

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
      var overlayColor = "transparent";

      if (data.show_overlay !== "never_show") {
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
          overlayColor = (0, _colorConverter.fromHex)(data.overlay_color, (0, _numberConverter.percentToDecimal)(data.overlay_transparency));
        }
      }

      return overlayColor;
    };

    return OverlayColorTransparency;
  }();

  return OverlayColorTransparency;
});
//# sourceMappingURL=overlay-color-transparency.js.map
