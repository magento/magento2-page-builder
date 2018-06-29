/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
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
      var result = {};
      var value = data[name];

      if (value && typeof value === "string") {
        value = JSON.parse(value);
      }

      if (undefined !== value && undefined !== value.margin) {
        result.marginLeft = value.margin.left ? value.margin.left + "px" : "";
        result.marginTop = value.margin.top ? value.margin.top + "px" : "";
        result.marginRight = value.margin.right ? value.margin.right + "px" : "";
        result.marginBottom = (parseInt(value.margin.bottom, 10) > 0 ? value.margin.bottom : 1) + "px";
      }

      return result;
    };

    return Margins;
  }();

  return Margins;
});
//# sourceMappingURL=margins.js.map
