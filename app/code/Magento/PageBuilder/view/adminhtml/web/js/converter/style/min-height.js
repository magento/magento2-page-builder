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
  var MinHeight =
  /*#__PURE__*/
  function () {
    "use strict";

    function MinHeight() {}

    var _proto = MinHeight.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value.indexOf("calc") !== -1 ? value.substring(5, value.length - 1) : value;
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
      return value.split(/\+|\-|\*|\//).length > 1 ? "calc(" + (0, _object.get)(data, name) + ")" : value;
    };

    return MinHeight;
  }();

  return MinHeight;
});
//# sourceMappingURL=min-height.js.map