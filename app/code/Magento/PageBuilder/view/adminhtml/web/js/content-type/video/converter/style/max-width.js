/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MaxWidth =
  /*#__PURE__*/
  function () {
    function MaxWidth() {}

    var _proto = MaxWidth.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value.replace("px", "");
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      if (!data[name]) {
        return "";
      }

      if (name === "max_width" && !data["max_height"]) {
        return data[name] + "px";
      }

      if (name === "max_height" && !data["max_width"]) {
        // Calculate the max width that would create the max height
        return data["max_height"] / 9 * 16 + "px";
      } // The max height won't be met with the supplied width


      if (data["max_width"] / 16 * 9 <= data["max_height"]) {
        return data["max_width"] + "px";
      } // Calculate the max width that would create the max height


      return data["max_height"] / 9 * 16 + "px";
    };

    return MaxWidth;
  }();

  return MaxWidth;
});
//# sourceMappingURL=max-width.js.map
