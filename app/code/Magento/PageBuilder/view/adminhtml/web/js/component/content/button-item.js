/*eslint-disable */
define(["underscore", "Magento_PageBuilder/js/content"], function (_underscore, _content) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ButtonItem =
  /*#__PURE__*/
  function (_Content) {
    _inheritsLoose(ButtonItem, _Content);

    function ButtonItem() {
      return _Content.apply(this, arguments) || this;
    }

    var _proto = ButtonItem.prototype;

    /**
     * Get the attributes for link
     * returns {object}
     */
    _proto.getLinkAttributes = function getLinkAttributes() {
      var data = this.parent.store.get(this.parent.id);

      if (_typeof(data.button_link) === "object") {
        var href = data.button_link[data.button_link.type];

        switch (data.button_link.type) {
          case "category":
            href = this.convertToCategoryWidget(href);
            break;

          case "product":
            href = this.convertToProductWidget(href);
            break;

          case "default":
            break;
        }

        return {
          data_attribute_link_type: data.button_link.type,
          href: href,
          target: data.button_link.setting === true ? "_blank" : ""
        };
      } else {
        return {
          data_attribute_link_type: "",
          href: "",
          target: ""
        };
      }
    };
    /**
     * Convert plain href string to category widget string
     *
     * @param {string} href
     * @returns {string}
     */


    _proto.convertToCategoryWidget = function convertToCategoryWidget(href) {
      var attributes = {
        type: "Magento\\Catalog\\Block\\Category\\Widget\\Link",
        id_path: "category/" + href,
        template: "category/widget/link/link_href.phtml",
        type_name: "Catalog Category Link"
      };

      var attributesString = _underscore.map(attributes, function (val, key) {
        return key + "='" + val + "'";
      }).join(" ");

      return "{{widget " + attributesString + " }}";
    };
    /**
     * Convert plain href string to product widget string
     *
     * @param {string} href
     * @returns {string}
     */


    _proto.convertToProductWidget = function convertToProductWidget(href) {
      var attributes = {
        type: "Magento\\Catalog\\Block\\Product\\Widget\\Link",
        id_path: "product/" + href,
        template: "category/widget/link/link_href.phtml",
        type_name: "Catalog Product Link"
      };

      var attributesString = _underscore.map(attributes, function (val, key) {
        return key + "='" + val + "'";
      }).join(" ");

      return "{{widget " + attributesString + " }}";
    };

    return ButtonItem;
  }(_content);

  return ButtonItem;
});
//# sourceMappingURL=button-item.js.map
