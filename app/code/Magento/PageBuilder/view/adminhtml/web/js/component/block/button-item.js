/*eslint-disable */
define(["../block/factory", "../config", "./block"], function (_factory, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var button =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(button, _Block);

    function button() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = button.prototype;

    /**
     * Add a button into the buttons container
     */
    _proto.addButton = function addButton() {
      var _this = this;

      (0, _factory)(_config.getInitConfig("contentTypes").button, this.parent.parent, this.stage, {}).then(function (button) {
        _this.addChild(button);

        button.edit.open();
      });
    };

    return button;
  }(_block);

  return button;
});
//# sourceMappingURL=button-item.js.map
