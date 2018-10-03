/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Locations =
  /*#__PURE__*/
  function () {
    function Locations() {}

    var _proto = Locations.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      if (value && value !== "") {
        return JSON.parse(value);
      }

      return [];
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      var content = data[name];

      if (typeof content === "string" && content !== "") {
        content = JSON.parse(content);
      }

      if (content && Object.keys(content).length) {
        content.each(function (marker) {
          if (marker.position) {
            marker.position.latitude = parseFloat(marker.position.latitude);
            marker.position.longitude = parseFloat(marker.position.longitude);
          }
        });
        return JSON.stringify(content);
      }

      return JSON.stringify([]);
    };

    return Locations;
  }();

  return _extends(Locations, {
    __esModule: true
  });
});
//# sourceMappingURL=locations.js.map
