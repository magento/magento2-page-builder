/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Heading =
  /*#__PURE__*/
  function () {
    function Heading() {}

    var _proto = Heading.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      return new Promise(function (resolve) {
        resolve({
          heading_type: element.nodeName.toLowerCase(),
          heading_text: element.innerText
        });
      });
    };

    return Heading;
  }();

  return Heading;
});
//# sourceMappingURL=heading.js.map
