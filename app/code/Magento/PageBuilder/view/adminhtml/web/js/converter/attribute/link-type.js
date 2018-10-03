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
  var CreateValueForLinkType =
  /*#__PURE__*/
  function () {
    function CreateValueForLinkType() {}

    var _proto = CreateValueForLinkType.prototype;

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
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return data[name] && data[name].type ? data[name].type : "default";
    };

    return CreateValueForLinkType;
  }();

  return _extends(CreateValueForLinkType, {
    __esModule: true
  });
});
//# sourceMappingURL=link-type.js.map
