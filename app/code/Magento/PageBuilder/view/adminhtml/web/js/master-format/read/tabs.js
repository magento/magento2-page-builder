/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Tabs =
  /*#__PURE__*/
  function () {
    function Tabs() {}

    var _proto = Tabs.prototype;

    /**
     * Read information from element for content type
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        tabs: []
      }; // Iterate through the tabs and retrieve their content

      _underscore.forEach(element.querySelectorAll(".title"), function (node, index) {
        response.tabs[index] = {
          content: node.nextSibling.innerHTML,
          record_id: index,
          title: node.firstChild.innerHTML
        };
      });

      return Promise.resolve(response);
    };

    return Tabs;
  }();

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
