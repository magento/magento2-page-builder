/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var BorderStyleDefault = /*#__PURE__*/function () {
    "use strict";

    function BorderStyleDefault() {}

    var _proto = BorderStyleDefault.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (!value) {
        return "_default";
      }

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
      var value = (0, _object.get)(data, name);

      if (value && value !== "_default") {
        return value;
      }
    };

    return BorderStyleDefault;
  }();

  return BorderStyleDefault;
});
//# sourceMappingURL=border-style.js.map