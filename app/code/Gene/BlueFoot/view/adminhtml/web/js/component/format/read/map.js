/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Tabs =
  /*#__PURE__*/
  function () {
    function Tabs() {}

    var _proto = Tabs.prototype;

    /**
     * Read map position and zoom from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var pattern = /maps\/embed\/v1\/place\?q=(-?[0-9.]*),*\s*(-?[0-9.]*)&zoom=*\s*([0-9]+)&key=([a-zA-Z0-9]+)/;

      if (element.getAttribute("src") && pattern.test(element.getAttribute("src"))) {
        return Promise.resolve({
          position: pattern.exec(element.getAttribute("src")).slice(1).join(",")
        });
      }
    };

    return Tabs;
  }();

  return Tabs;
});
//# sourceMappingURL=map.js.map
