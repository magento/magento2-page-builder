/*eslint-disable */
define(["../../../utils/color-converter"], function (_colorConverter) {
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
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "transparent" ? "" : (0, _colorConverter.toHex)(value);
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name];
    };

    return OverlayColor;
  }();

  return OverlayColor;
});
//# sourceMappingURL=overlay-color.js.map
