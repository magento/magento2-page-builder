/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonOpacity =
  /*#__PURE__*/
  function () {
    function ButtonOpacity() {}

    var _proto = ButtonOpacity.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      return data.show_button === "always" ? "1" : "0";
    };

    return ButtonOpacity;
  }();

  return _extends(ButtonOpacity, {
    __esModule: true
  });
});
//# sourceMappingURL=button-opacity.js.map
