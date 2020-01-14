/*eslint-disable */
/* jscs:disable */
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
    "use strict";

    function Display() {}

    var _proto = Display.prototype;

    /**
     * Ensure the display none property doesn't persist to the preview
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return;
    }
    /**
     * Ensure the display none property doesn't persist to the preview
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      return "flex";
    };

    return Display;
  }();

  return Display;
});
//# sourceMappingURL=flex.js.map