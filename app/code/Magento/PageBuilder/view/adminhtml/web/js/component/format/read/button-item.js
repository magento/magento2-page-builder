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
      var _buttonObject;

      var button = element.getElementsByTagName("a")[0];
      var advancedData = this.defaultReader.read(button);
      var attributeLinkType = button.getAttribute("data_attribute_link_type");
      var href = button.getAttribute("href");

      switch (attributeLinkType) {
        case "category":
          href = this.convertFromCategoryWidget(href);
          break;

        default:
          break;
      }

      var buttonObject = (_buttonObject = {}, _buttonObject[attributeLinkType] = href, _buttonObject.setting = button.target === "_blank" ? true : false, _buttonObject.type = attributeLinkType, _buttonObject);
      var response = {
        button_link: buttonObject,
        button_text: button.innerText,
        button_type: button.classList[0]
      };
      return advancedData.then(function (data) {
        delete data.css_classes;
        return Object.assign(data, response);
      });
    };
    /**
     * @param {string} href
     * @returns {string}
     */


    _proto.convertFromCategoryWidget = function convertFromCategoryWidget(href) {
      var matches = href.match(/id_path=['"]category\/(\d+)/);

      if (!matches) {
        return href;
      }

      return matches[1];
    };

    return ButtonItem;
  }();

  return ButtonItem;
});
//# sourceMappingURL=button-item.js.map
