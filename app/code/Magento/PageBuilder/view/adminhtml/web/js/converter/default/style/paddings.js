/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Paddings =
  /*#__PURE__*/
  function () {
    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * @param {string} value
     * @returns {Object | string}
     */
    _proto.fromDom = function fromDom(value) {
      var result = {};

      if (undefined !== value.padding) {
        result.padding = {
          left: value.padding.left.replace("px", ""),
          top: value.padding.top.replace("px", ""),
          right: value.padding.right.replace("px", ""),
          bottom: value.padding.bottom.replace("px", "")
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

      if (typeof value === "string") {
        value = JSON.parse(value);
      }

      var result = {};

      if (undefined !== value && undefined !== value.padding) {
        result.paddingLeft = value.padding.left + "px";
        result.paddingTop = value.padding.top + "px";
        result.paddingRight = value.padding.right + "px";
        result.paddingBottom = value.padding.bottom + "px";
      }

      return result;
    };

    return Paddings;
  }();

  return Paddings;
});
//# sourceMappingURL=paddings.js.map
