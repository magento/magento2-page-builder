/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/preview"], function (_translate, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Button =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Button, _Preview);

    function Button() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Preview.call.apply(_Preview, [this].concat(args)) || this, _this.buttonPlaceholder = (0, _translate)("Edit Button Text"), _temp) || _this;
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
    /**
     * Focus out of the element
     */


    _proto.onFocusOut = function onFocusOut() {
      this.parent.parent.preview.isLiveEditing(null);
    };

    return Button;
  }(_preview);

  return Button;
});
//# sourceMappingURL=button-item.js.map
