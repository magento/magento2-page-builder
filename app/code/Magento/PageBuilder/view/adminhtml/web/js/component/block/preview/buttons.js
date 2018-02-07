/*eslint-disable */
define(["../../block/factory", "../../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Buttons =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Buttons, _PreviewBlock);

    function Buttons(parent, config) {
      return _PreviewBlock.call(this, parent, config) || this;
    }
    /**
     * Add a button into the buttons container
     */


    var _proto = Buttons.prototype;

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
