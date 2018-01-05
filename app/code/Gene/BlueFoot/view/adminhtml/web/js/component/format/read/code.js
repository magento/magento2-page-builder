define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';
  /*eslint-disable */


  var Code =
  /*#__PURE__*/
  function () {
    function Code() {}

    var _proto = Code.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      return new Promise(function (resolve) {
        resolve({
          'snippet': element.children[0].innerHTML
        });
      });
    };

    return Code;
  }();

  return Code;
});
//# sourceMappingURL=code.js.map
