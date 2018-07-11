/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Color =
  /*#__PURE__*/
  function () {
    function Color() {}

    var _proto = Color.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value === "default" || value === "initial" || value === "") {
        value = "";
      } else {
        var regexp = /(\d{0,3}),\s(\d{0,3}),\s(\d{0,3})/;
        var matches = regexp.exec(value);

        if (matches) {
          value = "#" + this.fromIntToHex(parseInt(matches[1], 10)) + this.fromIntToHex(parseInt(matches[2], 10)) + this.fromIntToHex(parseInt(matches[3], 10));
        }
      }

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
      return data[name].toString();
    };
    /**
     * Convert from int to hex
     *
     * @param {number} value
     * @returns {string}
     */


    _proto.fromIntToHex = function fromIntToHex(value) {
      var hex = value.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return Color;
  }();

  return Color;
});
//# sourceMappingURL=color.js.map
