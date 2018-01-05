/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';

  var Buttons =
  /*#__PURE__*/
  function () {
    function Buttons() {}

    var _proto = Buttons.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        'buttons': []
      }; // Iterate through the tabs and retrieve their content

      _underscore.forEach(element.querySelectorAll('a'), function (node, index) {
        response.buttons[index] = {
          text: node.firstChild.innerText,
          link: node.getAttribute('href')
        };
      });

      return Promise.resolve(response);
    };

    return Buttons;
  }();

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
