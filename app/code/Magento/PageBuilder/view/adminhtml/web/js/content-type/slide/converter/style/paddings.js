/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object"], function (_underscore, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Paddings = /*#__PURE__*/function () {
    "use strict";

    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      var result = {};

      if (undefined !== value.padding) {
        result.padding = {
          bottom: value.padding.bottom.replace("px", ""),
          left: value.padding.left.replace("px", ""),
          right: value.padding.right.replace("px", ""),
          top: value.padding.top.replace("px", "")
        };
      }

      if (result.padding.right[0] === "c") {
        result.padding.right = parseInt(result.padding.right.split("+")[1].trim(), 10);
      }

      if (result.padding.left[0] === "c") {
        result.padding.left = parseInt(result.padding.left.split("+")[1].trim(), 10);
      }

      return result;
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var result = {};
      var value = (0, _object.get)(data, name);

      if (value && _underscore.isString(value)) {
        value = JSON.parse(value);
      }

      if (value && undefined !== value.padding) {
        result.paddingLeft = value.padding.left ? value.padding.left + "px" : "";
        result.paddingTop = value.padding.top ? value.padding.top + "px" : "";
        result.paddingRight = value.padding.right ? value.padding.right + "px" : "";
        result.paddingBottom = value.padding.bottom ? value.padding.bottom + "px" : "";
      }

      return result;
    };

    return Paddings;
  }();

  return Paddings;
});
//# sourceMappingURL=paddings.js.map