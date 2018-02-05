/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Button =
  /*#__PURE__*/
  function () {
    function Button() {}

    var _proto = Button.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var response = {
        button_link: element.getElementsByTagName('a')[0].getAttribute("href"),
        button_text: element.getAttribute("data-button-text"),
        button_type: element.getAttribute("data-button-type"),
        open_in_new_tab: element.getElementsByTagName('a')[0].getAttribute("target") === "_blank" ? '1' : '0'
      };
      return Promise.resolve(response);
    };

    return Button;
  }();

  return Button;
});
//# sourceMappingURL=button.js.map
