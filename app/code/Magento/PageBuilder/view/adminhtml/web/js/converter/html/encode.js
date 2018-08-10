/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Encode =
  /*#__PURE__*/
  function () {
    function Encode() {}

    var _proto = Encode.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value.replace(/&amp;lt;/g, "<").replace(/&amp;gt;/g, ">");
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name].toString().replace(/</g, "&amp;lt;").replace(/>/g, "&amp;gt;");
    };

    return Encode;
  }();

  return Encode;
});
//# sourceMappingURL=encode.js.map
