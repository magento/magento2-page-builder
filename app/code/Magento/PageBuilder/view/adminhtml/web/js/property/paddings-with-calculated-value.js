/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Paddings =
  /*#__PURE__*/
  function () {
    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * Read paddings from element with calculated value
     * Value to be read should be the second number in the equation
     * E.g. calc(50% + 40px)
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      var regex = /[+-]?\d+(?:\.\d+)?/g;
      return {
        padding: {
          left: element.style.paddingLeft.match(regex)[1] || element.style.paddingLeft,
          top: element.style.paddingTop.match(regex)[1] || element.style.paddingTop,
          right: element.style.paddingRight.match(regex)[1] || element.style.paddingRight,
          bottom: element.style.paddingBottom.match(regex)[1] || element.style.paddingBottom
        }
      };
    };

    return Paddings;
  }();

  return Paddings;
});
//# sourceMappingURL=paddings-with-calculated-value.js.map
