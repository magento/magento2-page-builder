/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Accordion =
  /*#__PURE__*/
  function () {
    function Accordion() {}

    var _proto = Accordion.prototype;

    /**
     * Read information from element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        items: []
      }; // Iterate through the tabs and retrieve their content

      _underscore.forEach(element.querySelectorAll("[data-collapsible='true']"), function (node, index) {
        response.items[index] = {
          content: node.nextSibling.innerHTML,
          open_on_load: node.getAttribute("data-open-on-load"),
          record_id: index,
          title: node.firstChild.firstChild.innerHTML
        };
      });

      return Promise.resolve(response);
    };

    return Accordion;
  }();

  return Accordion;
});
//# sourceMappingURL=accordion.js.map
