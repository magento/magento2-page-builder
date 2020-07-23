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
  var BorderWidth =
  /*#__PURE__*/
  function () {
    "use strict";

    function BorderWidth() {}

    var _proto = BorderWidth.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "initial" ? "" : value.replace("px", "");
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (value) {
        return value + "px";
      }
    };

    return BorderWidth;
  }();

  return BorderWidth;
});
//# sourceMappingURL=border-width.js.map