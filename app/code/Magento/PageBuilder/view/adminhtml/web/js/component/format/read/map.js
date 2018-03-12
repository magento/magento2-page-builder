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
      var pattern = /maps\/embed\/v1\/place\?q=(-?[0-9.]*),*\s*(-?[0-9.]*)&zoom=*\s*([0-9]+)&key=([a-zA-Z0-9]+)/;
      var result = {
        display: "inline-block"
      };

      if (element.getAttribute("src") && pattern.test(element.getAttribute("src"))) {
        result.position = pattern.exec(element.getAttribute("src")).slice(1).join(",");
      }

      return Promise.resolve(result);
    };

    return Map;
  }();

  return Map;
});
//# sourceMappingURL=map.js.map
