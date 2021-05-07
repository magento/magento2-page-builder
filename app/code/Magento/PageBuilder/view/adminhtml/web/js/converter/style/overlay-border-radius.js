/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Takes difference of border width from border radius to conform snugly to edges of wrapper border
   *
   * @api
   */
  var OverlayBorderRadius = /*#__PURE__*/function () {
    "use strict";

    function OverlayBorderRadius() {}

    var _proto = OverlayBorderRadius.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var borderRadius = data.border_radius ? parseInt(data.border_radius, 10) : 0;
      var borderWidth = data.border_width ? parseInt(data.border_width, 10) : 0;

      if (borderRadius <= borderWidth) {
        return "0";
      }

      return borderRadius - borderWidth + "px";
    };

    return OverlayBorderRadius;
  }();

  return OverlayBorderRadius;
});
//# sourceMappingURL=overlay-border-radius.js.map