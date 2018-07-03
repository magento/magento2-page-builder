/*eslint-disable */
define([], function () {
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
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name] ? data[name].type : "";
    };

    return CreateValueForLinkType;
  }();

  return CreateValueForLinkType;
});
//# sourceMappingURL=link-type.js.map
