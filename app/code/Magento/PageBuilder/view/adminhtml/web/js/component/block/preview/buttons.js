/*eslint-disable */
define(["../../block/factory", "../../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Buttons, _PreviewBlock);

    function Buttons() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Buttons.prototype;

    /**
     * Adds button-item to parent buttons
     */
    _proto.addButton = function addButton() {
      var _this = this;

      var createBlockParams = [_config.getInitConfig("content_types")["button-item"], this.parent, this.stage, {}];

      _factory.apply(void 0, createBlockParams).then(function (button) {
        _this.addChild(button);

        button.edit.open();
      }).catch(function (error) {
        console.error(error);
      });
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
