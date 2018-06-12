/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var TextAlign =
  /*#__PURE__*/
  function () {
    function TextAlign() {
      this.fromDomMap = {
        "flex-start": "left",
        "center": "center",
        "flex-end": "right"
      };
      this.toDomMap = {
        left: "flex-start",
        center: "center",
        right: "flex-end"
      };
    }

    var _proto = TextAlign.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (this.fromDomMap[value]) {
        return this.fromDomMap[value];
      }

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
      if (this.toDomMap[data[name]]) {
        return this.toDomMap[data[name]];
      }

      return data[name];
    };

    return TextAlign;
  }();

  return TextAlign;
});
//# sourceMappingURL=text-align.js.map
