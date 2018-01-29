/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Slide =
  /*#__PURE__*/
  function () {
    function Slide() {}

    var _proto = Slide.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var target = element.firstChild;
      var response = {
        content: element.querySelector("h3").nextSibling.innerHTML,
        link_text: element.querySelector("a") !== null ? element.querySelector("a").firstChild.firstChild.innerText : "",
        link_url: element.querySelector("a") !== null ? element.querySelector("a").getAttribute("href") : "",
        title: element.querySelector("h3").innerText
      };
      return Promise.resolve(response);
    };

    return Slide;
  }();

  return Slide;
});
//# sourceMappingURL=slide.js.map
