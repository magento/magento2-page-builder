/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ZIndex =
  /*#__PURE__*/
  function () {
    function ZIndex() {}

    var _proto = ZIndex.prototype;

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
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      if (data.border !== "_default") {
        return "-1";
      }

      return "0";
    };

    return ZIndex;
  }();

  return ZIndex;
});
//# sourceMappingURL=z-index.js.map
