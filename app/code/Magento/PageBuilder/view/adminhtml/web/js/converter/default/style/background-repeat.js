/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundRepeat =
  /*#__PURE__*/
  function () {
    function BackgroundRepeat() {}

    var _proto = BackgroundRepeat.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | Object}
     */
    _proto.fromDom = function fromDom(value) {
      return value === "repeat" ? "1" : "0";
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | Object}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name] === "1" ? "repeat" : "no-repeat";
    };

    return BackgroundRepeat;
  }();

  return BackgroundRepeat;
});
//# sourceMappingURL=background-repeat.js.map
