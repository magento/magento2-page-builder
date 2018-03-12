/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Map =
  /*#__PURE__*/
  function () {
    function Map() {}

    var _proto = Map.prototype;

    /**
     * Read map position and zoom from the element
     * Also removes display none back to inline-block for preview styles
     *
     * @param {HTMLElement} element
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var result = {
        display: "inline-block"
      };

      if (element.getAttribute('data-markers')) {
        var markers = JSON.parse(element.getAttribute('data-markers').replace(/'/g, "\""));
        var zoom = element.getAttribute('data-zoom');
        result.position = markers[0] + "," + zoom;
      }

      return Promise.resolve(result);
    };

    return Map;
  }();

  return Map;
});
//# sourceMappingURL=map.js.map
