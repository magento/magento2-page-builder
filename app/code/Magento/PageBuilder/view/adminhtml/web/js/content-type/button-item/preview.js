/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/preview"], function (_translate, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Preview =
  /*#__PURE__*/
  function (_BasePreview) {
    _inheritsLoose(Preview, _BasePreview);

    function Preview() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.buttonPlaceholder = (0, _translate)("Edit Button Text"), _temp) || _this;
    }

    var _proto = Preview.prototype;

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

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
