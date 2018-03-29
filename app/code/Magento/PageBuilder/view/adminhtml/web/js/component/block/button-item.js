/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/block"], function (_block) {
  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var ButtonItem =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(ButtonItem, _Block);

    function ButtonItem() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = ButtonItem.prototype;

    /**
     * Get the attributes for link
     * returns {object}
     */
    _proto.getLinkAttributes = function getLinkAttributes() {
      var data = this.getData();

      if (_typeof(data.button_link) === "object") {
        return {
          data_attribute_link_type: data.button_link.type,
          href: data.button_link[data.button_link.type],
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

    return ButtonItem;
  }(_block);

  return ButtonItem;
});
//# sourceMappingURL=button-item.js.map
