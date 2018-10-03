/*eslint-disable */
define(["Magento_PageBuilder/js/utils/color-converter"], function (_colorConverter) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayColor =
  /*#__PURE__*/
  function () {
    "use strict";

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
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name].toString();
    };

    return OverlayColor;
  }();

  return OverlayColor;
});
//# sourceMappingURL=overlay-color.js.map
