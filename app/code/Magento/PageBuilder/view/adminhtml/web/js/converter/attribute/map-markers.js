/*eslint-disable */
define([], function () {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var MapMarkers =
  /*#__PURE__*/
  function () {
    function MapMarkers() {}

    var _proto = MapMarkers.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value !== "" ? JSON.parse(value)[0] : value;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var result = data[name];

      if (_typeof(data[name]) === "object") {
        data[name].lat = parseFloat(data[name].lat);
        data[name].lng = parseFloat(data[name].lng);
        result = JSON.stringify([data[name]]);
      }

      return result;
    };

    return MapMarkers;
  }();

  return MapMarkers;
});
//# sourceMappingURL=map-markers.js.map
