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
  var Display =
  /*#__PURE__*/
  function () {
    function Display() {}

    var _proto = Display.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return !(value === "none");
    };
    /**
     * Convert value to knockout format, we only provide a none property if we intend for the content type to be hidden,
     * otherwise we let the original display property handle the display of the content type.
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      if (typeof data[name] !== "undefined" && data[name] === false) {
        return "none";
      }

      return;
    };

    return Display;
  }();

  return _extends(Display, {
    __esModule: true
  });
});
//# sourceMappingURL=display.js.map
