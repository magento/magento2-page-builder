/*eslint-disable */
define(["underscore", "./block"], function (_underscore, _block) {
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
     * Add initial button-item if children is empty
     *
     * @param element
     */
    _proto.afterChildrenRender = function afterChildrenRender(element) {
      var _this = this;

      _underscore.delay(function () {
        if (_this.parent.children().length === 0) {
          _this.parent.addButton();
        }
      }, 100);
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
