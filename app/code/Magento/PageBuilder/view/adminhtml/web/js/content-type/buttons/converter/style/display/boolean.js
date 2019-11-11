/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object"], function (_underscore, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Boolean =
  /*#__PURE__*/
  function () {
    "use strict";

    function Boolean() {}

    var _proto = Boolean.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return !(value === "none");
    }
    /**
     * Convert value to knockout format, if buttons are displayed they should be reset to default
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (!_underscore.isUndefined(value) && value === false) {
        return "none";
      }

      return "";
    };

    return Boolean;
  }();

  return Boolean;
});
//# sourceMappingURL=boolean.js.map