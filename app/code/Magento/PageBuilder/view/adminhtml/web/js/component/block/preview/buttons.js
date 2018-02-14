/*eslint-disable */
define(["./block"], function (_block) {
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
      if (this.parent.children().length === 0) {
        this.parent.addButton();
      }
    };

    return Buttons;
  }(_block);

  return Buttons;
});
//# sourceMappingURL=buttons.js.map
