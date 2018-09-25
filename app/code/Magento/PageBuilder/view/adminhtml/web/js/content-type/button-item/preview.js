/*eslint-disable */
define(["jquery", "knockout", "mage/translate", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _knockout, _translate, _conditionalRemoveOption, _preview) {
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

      delete options.title;
      delete options.move;
      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    };
    /**
     * Force the focus on the clicked button
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */


    _proto.onClick = function onClick(index, event) {
      (0, _jquery)(event.currentTarget).find("[contenteditable]").focus();
      event.stopPropagation();
    };
    /**
     * Handle on focus out events, when the button item is focused out we need to set our focusedButton record on the
     * buttons preview item to null. If we detect this focus out event is to focus into another button we need to ensure
     * we update the record appropriately.
     *
     * @param {number} index
     * @param {Event} event
     */


    _proto.onFocusOut = function onFocusOut(index, event) {
      if (this.parent && this.parent.parent) {
        var parentPreview = this.parent.parent.preview;

        var unfocus = function unfocus() {
          window.getSelection().removeAllRanges();
          parentPreview.focusedButton(null);
        };

        if (event.relatedTarget && _jquery.contains(parentPreview.wrapperElement, event.relatedTarget)) {
          // Verify the focus was not onto the options menu
          if ((0, _jquery)(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
            unfocus();
          } else {
            // Have we moved the focus onto another button in the current group?
            var buttonItem = _knockout.dataFor(event.relatedTarget);

            if (buttonItem && buttonItem.parent && buttonItem.parent.parent) {
              var newIndex = buttonItem.parent.parent.children().indexOf(buttonItem.parent);
              parentPreview.focusedButton(newIndex);
            }
          }
        } else if (parentPreview.focusedButton() === index) {
          unfocus();
        }
      }
    };
    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */


    _proto.onFocusIn = function onFocusIn(index, event) {
      var parentPreview = this.parent.parent.preview;

      if (parentPreview.focusedButton() !== index) {
        parentPreview.focusedButton(index);
      }
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
