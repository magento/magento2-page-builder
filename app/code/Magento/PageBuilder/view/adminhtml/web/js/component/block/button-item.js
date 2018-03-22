/*eslint-disable */
define(["./block"], function (_block) {
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
      return {
        //add here logic to
        href: data.button_link[data.button_link.type],
        data_attribute_link_type: data.button_link.type,
        target: data.button_link.setting == true ? "_blank" : ""
      };
    };

    return ButtonItem;
  }(_block);

  return ButtonItem;
});
//# sourceMappingURL=button-item.js.map
