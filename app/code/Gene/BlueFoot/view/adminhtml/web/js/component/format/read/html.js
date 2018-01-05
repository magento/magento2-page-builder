/*eslint-disable */
define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';

  var Html =
  /*#__PURE__*/
  function () {
    function Html() {}

    var _proto = Html.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      return new Promise(function (resolve) {
        resolve({
          'html': element.innerHTML
        });
      });
    };

    return Html;
  }();

  return Html;
});
//# sourceMappingURL=html.js.map
