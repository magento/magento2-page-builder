/*eslint-disable */
define(["underscore", "../../utils/delayed-promise", "../block/factory", "../config", "./block"], function (_underscore, _delayedPromise, _factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Buttons, _Block);

    function Buttons(parent, stage, config, formData) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData) || this; // On first drop, automatically add the first button-item child

      _this.on("blockReady", _underscore.bind(_this.addButton, _this));

      return _this;
    }
    /**
     * Add button-item to buttons children array
     */


    var _proto = Buttons.prototype;

    _proto.addButton = function addButton() {
      var _this2 = this;

      var createBlockPromise = (0, _factory)(_config.getInitConfig("content_types")["button-item"], this.parent, this.stage, {});
      createBlockPromise.then(function (button) {
        _this2.addChild(button);

        return button;
      }).then((0, _delayedPromise)(300)).then(function (button) {
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
