/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Zoom =
  /*#__PURE__*/
  function () {
    function Zoom() {}

    var _proto = Zoom.prototype;

    /**
     * Read zoom from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      if (element.getAttribute("data-zoom")) {
        return {
          zoom: parseInt(element.getAttribute("data-zoom"), 10)
        };
      }

      return {};
    };

    return Zoom;
  }();

  return Zoom;
});
//# sourceMappingURL=zoom.js.map
