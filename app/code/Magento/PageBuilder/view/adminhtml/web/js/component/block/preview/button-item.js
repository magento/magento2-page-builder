/*eslint-disable */
define(["Magento_PageBuilder/js/component/block/preview/block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Button =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Button, _PreviewBlock);

    function Button() {
      return _PreviewBlock.apply(this, arguments) || this;
    }

    var _proto = Button.prototype;

    /**
     * After child render record element
     * returns {object}
     */
    _proto.childrenStyle = function childrenStyle() {
      return {
        display: "inline-block"
      };
    };

    return Button;
  }(_block);

  return Button;
});
//# sourceMappingURL=button-item.js.map
