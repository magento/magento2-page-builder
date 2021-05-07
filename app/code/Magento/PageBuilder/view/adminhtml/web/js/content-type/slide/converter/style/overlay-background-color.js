/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var OverlayBackgroundColor = /*#__PURE__*/function () {
    "use strict";

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
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (data.show_overlay === "always" && value !== "" && value !== undefined) {
        return value;
      }

      return "transparent";
    };

    return OverlayBackgroundColor;
  }();

  return OverlayBackgroundColor;
});
//# sourceMappingURL=overlay-background-color.js.map