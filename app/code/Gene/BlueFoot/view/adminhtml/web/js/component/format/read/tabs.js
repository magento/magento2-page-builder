define(["underscore"], function (_underscore) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Image =
  /*#__PURE__*/
  function () {
    function Image() {}

    var _proto = Image.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        'tabs': []
      }; // Iterate through the tabs and retrieve their content

      _underscore.forEach(element.querySelectorAll('.title'), function (node, index) {
        response.tabs[index] = {
          title: node.firstChild.innerHTML,
          content: node.nextSibling.innerHTML,
          record_id: index
        };
      });

      return Promise.resolve(response);
    };

    return Image;
  }();

  return Image;
});
//# sourceMappingURL=tabs.js.map
