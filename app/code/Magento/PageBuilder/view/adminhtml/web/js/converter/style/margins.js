/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

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
          top: value.margin.top.replace("px", ""),
          left: value.margin.left.replace("px", ""),
          right: value.margin.right.replace("px", ""),
          bottom: value.margin.bottom.replace("px", "")
        };
      }

      return result;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      var result = {};
      var value = data[name];

      if (value && typeof value === "string") {
        value = JSON.parse(value);
      }

      if (value && undefined !== value.margin) {
        result.marginLeft = value.margin.left ? value.margin.left + "px" : "";
        result.marginTop = value.margin.top ? value.margin.top + "px" : "";
        result.marginRight = value.margin.right ? value.margin.right + "px" : "";
        result.marginBottom = value.margin.bottom ? value.margin.bottom + "px" : "";
      }

      return result;
    };

    return Margins;
  }();

  return _extends(Margins, {
    __esModule: true
  });
});
//# sourceMappingURL=margins.js.map
