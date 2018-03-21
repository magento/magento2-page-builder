/*eslint-disable */
define(["./block"], function (_block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Button =
  /*#__PURE__*/
  function (_PreviewBlock) {
    _inheritsLoose(Button, _PreviewBlock);

    function Button() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _PreviewBlock.call.apply(_PreviewBlock, [this].concat(args)) || this, _this.element = void 0, _temp) || _this;
    }

    var _proto = Button.prototype;

    /**
     * After child render record element
     *
     * @param {Element} element
     */
    _proto.onAfterRender = function onAfterRender(element) {
      this.element = element;
    };
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
