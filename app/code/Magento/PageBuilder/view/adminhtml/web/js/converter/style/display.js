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
  var Display =
  /*#__PURE__*/
  function () {
    "use strict";

    function Display() {}

    var _proto = Display.prototype;

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
     * Convert value to knockout format, we only provide a none property if we intend for the content type to be hidden,
     * otherwise we let the original display property handle the display of the content type.
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

      return;
    };

    return Display;
  }();

  return Display;
});
//# sourceMappingURL=display.js.map