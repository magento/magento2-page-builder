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
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return;
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string | object}
     */


    _proto.toDom = function toDom(name, data) {
      if (data[name]) {
        var content = data[name];

        if (typeof content === "string" && content !== "") {
          content = JSON.parse(content);
        }

        return content.zoom;
      }

      return;
    };

    return Zoom;
  }();

  return Zoom;
});
//# sourceMappingURL=zoom.js.map
