/*eslint-disable */
define(["./default"], function (_default) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ButtonItem =
  /*#__PURE__*/
  function () {
    function ButtonItem() {
      this.defaultReader = new _default();
    }

    var _proto = ButtonItem.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var advancedData = this.defaultReader.read(element.querySelector(".pagebuilder-button"));
      var response = {
        button_link: element.getElementsByTagName('a')[0].getAttribute("href"),
        button_text: element.getAttribute("data-button-text"),
        button_type: element.getAttribute("data-button-type"),
        open_in_new_tab: element.getElementsByTagName('a')[0].getAttribute("target") === "_blank" ? '1' : '0'
      };
      return new Promise(function (resolve) {
        advancedData.then(function (data) {
          delete data.css_classes;
          resolve(Object.assign(data, response));
        });
      });
    };

    return ButtonItem;
  }();

  return ButtonItem;
});
//# sourceMappingURL=button-item.js.map
