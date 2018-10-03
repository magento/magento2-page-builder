/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/utils/directives"], function (_directives) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Directives =
  /*#__PURE__*/
  function () {
    function Directives() {}

    var _proto = Directives.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return (0, _directives.convertMediaDirectivesToUrls)((0, _directives.removeQuotesInMediaDirectives)(data[name]));
    };

    return Directives;
  }();

  return _extends(Directives, {
    __esModule: true
  });
});
//# sourceMappingURL=directive.js.map
