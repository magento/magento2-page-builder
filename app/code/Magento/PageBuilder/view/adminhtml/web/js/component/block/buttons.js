/*eslint-disable */
define(["../../utils/delayed-promise", "../block/factory", "../config", "./block"], function (_delayedPromise, _factory, _config, _block) {
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
     * Add button-item to buttons children array
     */
    _proto.addButton = function addButton() {
      var _this = this;

      var createBlockPromise = (0, _factory)(_config.getInitConfig("content_types")["button-item"], this.parent, this.stage, {});
      createBlockPromise.then(function (button) {
        _this.addChild(button);

        return button;
      }).then((0, _delayedPromise)(300)).then(function (button) {
        button.edit.open();
      }).catch(function (error) {
        console.error(error);
      });
    };

    return ButtonItem;
  }(_block);

  return ButtonItem;
});
//# sourceMappingURL=buttons.js.map
