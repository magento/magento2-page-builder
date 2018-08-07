/*eslint-disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var WhiteSpace =
  /*#__PURE__*/
  function () {
    function WhiteSpace() {}

    var _proto = WhiteSpace.prototype;

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
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      if (!_config.getConfig("can_use_inline_editing_on_stage")) {
        return "pre";
      }

      return "";
    };

    return WhiteSpace;
  }();

  return WhiteSpace;
});
//# sourceMappingURL=white-space.js.map
