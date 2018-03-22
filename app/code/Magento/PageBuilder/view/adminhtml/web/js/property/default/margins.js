/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

    /**
     * Read margins from element
     *
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    _proto.read = function read(element) {
      return {
        margin: {
          bottom: element.style.marginBottom,
          left: element.style.marginLeft,
          right: element.style.marginRight,
          top: element.style.marginTop
        }
      };
    };

    return Margins;
  }();

  return Margins;
});
//# sourceMappingURL=margins.js.map
