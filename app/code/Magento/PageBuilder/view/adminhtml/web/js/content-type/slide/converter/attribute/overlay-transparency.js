/*eslint-disable */
define(["Magento_PageBuilder/js/utils/extract-alpha-from-rgba"], function (_extractAlphaFromRgba) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayTransparency =
  /*#__PURE__*/
  function () {
    "use strict";

    function OverlayTransparency() {}

    var _proto = OverlayTransparency.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "transparent" ? "0" : (0, _extractAlphaFromRgba)(value);
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name];
    };

    return OverlayTransparency;
  }();

  return OverlayTransparency;
});
//# sourceMappingURL=overlay-transparency.js.map
