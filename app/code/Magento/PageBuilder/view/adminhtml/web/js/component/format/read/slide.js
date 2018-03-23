/*eslint-disable */
define(["./default"], function (_default) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Slide =
  /*#__PURE__*/
  function () {
    function Slide() {
      this.defaultReader = new _default();
    }

    var _proto = Slide.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        content: element.querySelector("h3").nextSibling.innerHTML,
        link_text: element.querySelector("a") !== null ? element.querySelector("a").firstChild.firstChild.innerText : "",
        link_url: element.querySelector("a") !== null ? element.querySelector("a").getAttribute("href") : "",
        title: element.querySelector("h3").innerText
      };
      var slideAttributeElement = element.querySelector("div");
      var slideAttributesPromise = this.defaultReader.read(slideAttributeElement);
      return slideAttributesPromise.then(function (slideAttributes) {
        return Promise.resolve(Object.assign(slideAttributes, response));
      });
    };

    return Slide;
  }();

  return Slide;
});
//# sourceMappingURL=slide.js.map
