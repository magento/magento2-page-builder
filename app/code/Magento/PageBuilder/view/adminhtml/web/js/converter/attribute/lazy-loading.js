/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright 2026 Adobe
   * All Rights Reserved.
   */

  /**
   * @api
   */
  var LazyLoading = /*#__PURE__*/function () {
    "use strict";

    function LazyLoading() {}

    var _proto = LazyLoading.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    _proto.fromDom = function fromDom(value) {
      return "lazy" === value ? "1" : "0";
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data DataObject
     * @returns {string | boolean}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);
      return !value || "0" === value ? false : "lazy";
    };

    return LazyLoading;
  }();

  return LazyLoading;
});
//# sourceMappingURL=lazy-loading.js.map