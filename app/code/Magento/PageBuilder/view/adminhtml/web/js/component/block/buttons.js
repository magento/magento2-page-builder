/*eslint-disable */
define(["../block/factory", "../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Buttons, _Block);

    function Buttons() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Buttons.prototype;

    /**
     * Add a button into the buttons container
     */
    _proto.addButton = function addButton() {
      var _this = this;

      (0, _factory)(_config.getInitConfig("contentTypes").button, this.parent, this.stage, {}).then(function (button) {
        _this.addChild(button);

        button.edit.open();
      });
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
