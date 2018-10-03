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
  var BorderStyleDefault =
  /*#__PURE__*/
  function () {
    function BorderStyleDefault() {}

    var _proto = BorderStyleDefault.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (!value) {
        return "_default";
      }

      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      if (data[name] && data[name] !== "_default") {
        return data[name].toString();
      }
    };

    return BorderStyleDefault;
  }();

  return _extends(BorderStyleDefault, {
    __esModule: true
  });
});
//# sourceMappingURL=border-style.js.map
