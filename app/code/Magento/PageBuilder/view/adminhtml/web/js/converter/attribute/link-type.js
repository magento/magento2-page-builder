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
  var CreateValueForLinkType =
  /*#__PURE__*/
  function () {
    "use strict";

    function CreateValueForLinkType() {}

    var _proto = CreateValueForLinkType.prototype;

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
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);
      return value && value.type ? value.type : "default";
    };

    return CreateValueForLinkType;
  }();

  return CreateValueForLinkType;
});
//# sourceMappingURL=link-type.js.map