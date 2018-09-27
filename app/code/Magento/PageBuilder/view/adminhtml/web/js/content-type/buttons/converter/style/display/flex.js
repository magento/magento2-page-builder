/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Flex =
  /*#__PURE__*/
  function () {
    function Flex() {}

    var _proto = Flex.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return !(value === "none");
    };
    /**
     * Convert value to knockout format, if buttons are displayed they should be inline block
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      if (typeof data[name] !== "undefined" && data[name] === false) {
        return "none";
      }

      return "flex";
    };

    return Flex;
  }();

  return Object.assign(Flex, {
    __esModule: true
  });
});
//# sourceMappingURL=flex.js.map
