/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type/preview"], function (_translate, _conditionalRemoveOption, _preview) {
  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * @api
   */
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
     * Use the conditional remove to disable the option when the parent has a single child
     *
     * @returns {OptionsInterface}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _BasePreview.prototype.retrieveOptions.call(this);

      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    };
    /**
     * Focus out of the element
     */


    _proto.onFocusOut = function onFocusOut() {
      this.parent.parent.preview.isLiveEditing(null);
    };
    /**
     * If the button is displayed we need to show the options menu on hover
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onButtonMouseOver = function onButtonMouseOver(context, event) {
      if (this.display() === false) {
        this.onMouseOver(context, event);
      }
    };
    /**
     * If the button is displayed we need to hide the options menu on mouse out
     *
     * @param {Preview} context
     * @param {Event} event
     */


    _proto.onButtonMouseOut = function onButtonMouseOut(context, event) {
      if (this.display() === false) {
        this.onMouseOut(context, event);
      }
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
