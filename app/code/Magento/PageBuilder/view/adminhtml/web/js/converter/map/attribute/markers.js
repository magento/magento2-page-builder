/*eslint-disable */
define(["underscore"], function (_underscore) {
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
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
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

      if (content && _underscore.every(["lat", "lng"], function (key) {
        return _underscore.has(content, key);
      })) {
        var result = {
          lat: content.lat,
          lng: content.lng
        };
        return JSON.stringify([result]);
      }

      return JSON.stringify([]);
    };

    return Markers;
  }();

  return Markers;
});
//# sourceMappingURL=markers.js.map
