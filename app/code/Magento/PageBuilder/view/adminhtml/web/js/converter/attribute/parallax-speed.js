/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright 2026 Adobe
   * All Rights Reserved.
   */
  var ParallaxSpeed = /*#__PURE__*/function () {
    "use strict";

    function ParallaxSpeed() {}

    var _proto = ParallaxSpeed.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    _proto.fromDom = function fromDom(value) {
      return value === null || value === undefined ? "0.5" : value;
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | boolean}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var enableParallax = (0, _object.get)(data, "enable_parallax");

      if (!enableParallax || enableParallax === "0") {
        return false;
      }

      var value = (0, _object.get)(data, name);

      if (value === null || value === undefined) {
        return false;
      }

      return value.toString();
    };

    return ParallaxSpeed;
  }();

  return ParallaxSpeed;
});
//# sourceMappingURL=parallax-speed.js.map