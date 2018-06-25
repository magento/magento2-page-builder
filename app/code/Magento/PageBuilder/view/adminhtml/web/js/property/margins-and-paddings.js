/*eslint-disable */
define(["Magento_PageBuilder/js/property/margins", "Magento_PageBuilder/js/property/paddings"], function (_margins, _paddings) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var MarginsAndPaddings =
  /*#__PURE__*/
  function () {
    function MarginsAndPaddings() {
      this.margins = void 0;
      this.paddings = void 0;
      this.margins = new _margins();
      this.paddings = new _paddings();
    }
    /**
     * Read margins and paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */


    var _proto = MarginsAndPaddings.prototype;

    _proto.read = function read(element) {
      return Object.assign(this.margins.read(element), this.paddings.read(element));
    };

    return MarginsAndPaddings;
  }();

  return MarginsAndPaddings;
});
//# sourceMappingURL=margins-and-paddings.js.map
