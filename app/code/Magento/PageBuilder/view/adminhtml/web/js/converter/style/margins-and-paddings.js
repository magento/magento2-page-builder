/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var MarginsAndPaddings =
  /*#__PURE__*/
  function () {
    function MarginsAndPaddings() {}

    var _proto = MarginsAndPaddings.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      var result = {};

      if (undefined !== value.margin) {
        result.margin = {
          bottom: value.margin.bottom.replace("px", ""),
          left: value.margin.left.replace("px", ""),
          right: value.margin.right.replace("px", ""),
          top: value.margin.top.replace("px", "")
        };
      }

      if (undefined !== value.padding) {
        result.padding = {
          bottom: value.padding.bottom.replace("px", ""),
          left: value.padding.left.replace("px", ""),
          right: value.padding.right.replace("px", ""),
          top: value.padding.top.replace("px", "")
        };
      }

      return result;
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

      if (value) {
        if (undefined !== value.margin) {
          result.marginLeft = value.margin.left + "px";
          result.marginTop = value.margin.top + "px";
          result.marginRight = value.margin.right + "px";
          result.marginBottom = value.margin.bottom + "px";
        }

        if (undefined !== value.padding) {
          result.paddingLeft = value.padding.left + "px";
          result.paddingTop = value.padding.top + "px";
          result.paddingRight = value.padding.right + "px";
          result.paddingBottom = value.padding.bottom + "px";
        }
      }

      return result;
    };

    return MarginsAndPaddings;
  }();

  return MarginsAndPaddings;
});
//# sourceMappingURL=margins-and-paddings.js.map
