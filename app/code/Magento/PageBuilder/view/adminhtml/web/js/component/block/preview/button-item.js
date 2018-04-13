/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/preview"], function (_translate, _preview) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Button =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Button, _Preview);

    /**
     * Button constructor
     *
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    function Button(parent, config, elementConverterPool, dataConverterPool) {
      var _this;

      _this = _Preview.call(this, parent, config, elementConverterPool, dataConverterPool) || this;
      _this.buttonPlaceholder = (0, _translate)("Edit Button Text");
      return _this;
    }
    /**
     * After child render record element
     * returns {object}
     */


    var _proto = Button.prototype;

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
