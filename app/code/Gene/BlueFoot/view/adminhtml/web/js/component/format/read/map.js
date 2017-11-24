define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Tabs =
  /*#__PURE__*/
  function () {
    function Tabs() {}

    var _proto = Tabs.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var pattern = /maps\/embed.*\s*center=(-?[0-9.]*),(-?[0-9.]*)&zoom=([0-9]*)/;

      if (element.getAttribute('src') && pattern.test(element.getAttribute('src'))) {
        return Promise.resolve({
          'position': pattern.exec(element.getAttribute('src')).slice(1).join(',')
        });
      }
    };

    return Tabs;
  }();

  return Tabs;
});
//# sourceMappingURL=map.js.map
