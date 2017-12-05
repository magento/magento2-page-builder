define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
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
      var target = element.firstChild,
          response = {
        link_text: element.querySelector('a') !== null ? element.querySelector('a').firstChild.firstChild.innerText : "",
        link_url: element.querySelector('a') !== null ? element.querySelector('a').getAttribute('href') : "",
        title: element.querySelector('h3').innerText,
        content: element.querySelector('h3').nextSibling.innerHTML
      };
      return Promise.resolve(response);
    };

    return Slide;
  }();

  return Slide;
});
//# sourceMappingURL=slide.js.map
