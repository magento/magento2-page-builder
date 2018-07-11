/*eslint-disable */
define(["Magento_PageBuilder/js/utils/color-converter", "Magento_PageBuilder/js/utils/number-converter"], function (_colorConverter, _numberConverter) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayBackgroundColor =
  /*#__PURE__*/
  function () {
    function OverlayBackgroundColor() {}

    var _proto = OverlayBackgroundColor.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      var overlayColor = "transparent";

      if (data.show_overlay === "always" && data.overlay_color !== "" && data.overlay_color !== undefined) {
        overlayColor = (0, _colorConverter.fromHex)(data.overlay_color.toString(), (0, _numberConverter.percentToDecimal)(data.overlay_transparency.toString()));
      }

      return overlayColor;
    };

    return OverlayBackgroundColor;
  }();

  return OverlayBackgroundColor;
});
//# sourceMappingURL=overlay-background-color.js.map
