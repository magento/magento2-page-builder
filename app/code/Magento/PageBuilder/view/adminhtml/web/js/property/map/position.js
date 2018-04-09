/*eslint-disable */
define(["Magento_PageBuilder/js/property/map/markers", "Magento_PageBuilder/js/property/map/zoom"], function (_markers, _zoom) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Position =
  /*#__PURE__*/
  function () {
    function Position() {
      this.zoom = void 0;
      this.markers = void 0;
      this.zoom = new _zoom();
      this.markers = new _markers();
    }
    /**
     * Read position from zoom and marker from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */


    var _proto = Position.prototype;

    _proto.read = function read(element) {
      return JSON.stringify(Object.assign({}, this.markers.read(element), this.zoom.read(element)));
    };

    return Position;
  }();

  return Position;
});
//# sourceMappingURL=position.js.map
