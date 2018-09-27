/*eslint-disable */
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

  return Object.assign(Locations, {
    __esModule: true
  });
});
//# sourceMappingURL=locations.js.map
