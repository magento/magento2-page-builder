/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Button =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Button, _PreviewBlock);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    function Button(parent, config) {
      return _PreviewBlock.call(this, parent, config) || this;
    }

    return Button;
  }(_block);

  return Button;
});
//# sourceMappingURL=button.js.map
