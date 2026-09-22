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
      return value === null || value === undefined ? ParallaxSpeed.DEFAULT : value;
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
      var value = (0, _object.get)(data, name);

      if (value === null || value === undefined || value === "") {
        return false;
      }

      var speed = value.toString();
      var enableParallax = (0, _object.get)(data, "enable_parallax");

      if (speed === ParallaxSpeed.DEFAULT && (!enableParallax || enableParallax === "0")) {
        return false;
      }

      return speed;
    };

    return ParallaxSpeed;
  }();

  ParallaxSpeed.DEFAULT = "0.5";
  return ParallaxSpeed;
});
//# sourceMappingURL=parallax-speed.js.map