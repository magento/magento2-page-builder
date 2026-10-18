/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright 2026 Adobe
   * All Rights Reserved.
   */
  var EnableParallax = /*#__PURE__*/function () {
    "use strict";

    function EnableParallax() {}

    var _proto = EnableParallax.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    _proto.fromDom = function fromDom(value) {
      return value === null || value === undefined ? "0" : value;
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

      if (!value || value === "0") {
        return false;
      }

      return value.toString();
    };

    return EnableParallax;
  }();

  return EnableParallax;
});
//# sourceMappingURL=enable-parallax.js.map