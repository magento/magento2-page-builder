/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MarginsAndPaddings =
  /*#__PURE__*/
  function () {
    function MarginsAndPaddings() {}

    var _proto = MarginsAndPaddings.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      var result = {};

      if (undefined !== value.margin) {
        result["margin"] = {
          "left": value.margin.left.replace("px", ""),
          "top": value.margin.top.replace("px", ""),
          "right": value.margin.right.replace("px", ""),
          "bottom": value.margin.bottom.replace("px", "")
        };
      }

      if (undefined !== value.padding) {
        result["padding"] = {
          "left": value.padding.left.replace("px", ""),
          "top": value.padding.top.replace("px", ""),
          "right": value.padding.right.replace("px", ""),
          "bottom": value.padding.bottom.replace("px", "")
        };
      }

      return result;
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */


    _proto.toDom = function toDom(name, data) {
      var value = data[name];

      if (value && typeof value === "string") {
        value = JSON.parse(value);
      }

      var result = {};

      if (undefined !== value && undefined !== value.margin) {
        result["marginLeft"] = value.margin.left + "px";
        result["marginTop"] = value.margin.top + "px";
        result["marginRight"] = value.margin.right + "px";
        result["marginBottom"] = value.margin.bottom + "px";
      }

      if (undefined !== value && undefined !== value.padding) {
        result["paddingLeft"] = value.padding.left + "px";
        result["paddingTop"] = value.padding.top + "px";
        result["paddingRight"] = value.padding.right + "px";
        result["paddingBottom"] = value.padding.bottom + "px";
      }

      return result;
    };

    return MarginsAndPaddings;
  }();

  return MarginsAndPaddings;
});
//# sourceMappingURL=margins-and-paddings.js.map
