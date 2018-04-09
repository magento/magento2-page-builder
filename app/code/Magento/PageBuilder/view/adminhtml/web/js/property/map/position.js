/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Position =
  /*#__PURE__*/
  function () {
    function Position() {}

    var _proto = Position.prototype;

    /**
     * Read position from zoom and marker from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      var markers = element.getAttribute("data-markers") !== "" ? JSON.parse(element.getAttribute("data-markers"))[0] : {};
      var zoom = element.getAttribute("data-zoom") ? {
        zoom: parseInt(element.getAttribute("data-zoom"), 10)
      } : {};
      return JSON.stringify(Object.assign({}, markers, zoom));
    };

    return Position;
  }();

  return Position;
});
//# sourceMappingURL=position.js.map
