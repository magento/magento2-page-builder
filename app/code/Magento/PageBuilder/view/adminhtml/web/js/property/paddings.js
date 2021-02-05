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
  var Paddings = /*#__PURE__*/function () {
    "use strict";

    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * Read paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      return {
        padding: {
          left: element.style.paddingLeft,
          top: element.style.paddingTop,
          right: element.style.paddingRight,
          bottom: element.style.paddingBottom
        }
      };
    };

    return Paddings;
  }();

  return Paddings;
});
//# sourceMappingURL=paddings.js.map