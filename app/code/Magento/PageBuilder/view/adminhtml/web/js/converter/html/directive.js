/*eslint-disable */
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

  return Directives;
});
//# sourceMappingURL=directive.js.map
