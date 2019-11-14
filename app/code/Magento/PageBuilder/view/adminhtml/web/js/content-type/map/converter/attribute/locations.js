/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/object"], function (_underscore, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Locations =
  /*#__PURE__*/
  function () {
    "use strict";

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
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var content = (0, _object.get)(data, name);

      if (_underscore.isString(content) && content !== "") {
        content = JSON.parse(content);
      }

      if (content && Object.keys(content).length) {
        content.forEach(function (marker) {
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

  return Locations;
});
//# sourceMappingURL=locations.js.map