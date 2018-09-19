/*eslint-disable */
define(["Magento_PageBuilder/js/utils/color-converter"], function (_colorConverter) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayColor =
  /*#__PURE__*/
  function () {
    function OverlayColor() {}

    var _proto = OverlayColor.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "transparent" ? "" : (0, _colorConverter.toHex)(value);
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name];
    };

    return OverlayColor;
  }();

  return Object.assign(OverlayColor, {
    __esModule: true
  });
});
//# sourceMappingURL=overlay-color.js.map
