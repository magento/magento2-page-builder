/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Markers =
  /*#__PURE__*/
  function () {
    function Markers() {}

    var _proto = Markers.prototype;

    /**
     * Read markers from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      if (element.getAttribute("data-markers") !== "") {
        return JSON.parse(element.getAttribute("data-markers"))[0];
      }

      return;
    };

    return Markers;
  }();

  return Markers;
});
//# sourceMappingURL=markers.js.map
