/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "knockout", "Magento_PageBuilder/js/content-type-menu/conditional-remove-option", "Magento_PageBuilder/js/content-type/preview-collection"], function (_jquery, _knockout, _conditionalRemoveOption, _previewCollection) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_previewCollection2) {
    "use strict";

    _inheritsLoose(Preview, _previewCollection2);

    function Preview() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _previewCollection2.call.apply(_previewCollection2, [this].concat(args)) || this;
      _this.fieldsToIgnoreOnRemove = ["tab_name"];
      return _this;
    }

    var _proto = Preview.prototype;

    /**
     * Force the focus on the clicked tab header
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    _proto.onClick = function onClick(index, event) {
      (0, _jquery)(event.currentTarget).find("[contenteditable]").focus();
      event.stopPropagation();
    }
    /**
     * On focus in set the focused button
     *
     * @param {number} index
     * @param {Event} event
     */
    ;

    _proto.onFocusIn = function onFocusIn(index, event) {
      var parentPreview = this.parent.parent.preview;

      if (parentPreview.focusedTab() !== index) {
        parentPreview.setFocusedTab(index, true);
      }
    }
    /**
     * On focus out set the focused tab to null
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */
    ;

    _proto.onFocusOut = function onFocusOut(index, event) {
      if (this.parent && this.parent.parent) {
        var parentPreview = this.parent.parent.preview;

        var unfocus = function unfocus() {
          window.getSelection().removeAllRanges();
          parentPreview.focusedTab(null);
        };

        if (event.relatedTarget && _jquery.contains(parentPreview.wrapperElement, event.relatedTarget)) {
          // Verify the focus was not onto the options menu
          if ((0, _jquery)(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
            unfocus();
          } else {
            // Have we moved the focus onto another button in the current group?
            var tabItem = _knockout.dataFor(event.relatedTarget);

            if (tabItem && tabItem.parent && tabItem.parent.parent && tabItem.parent.parent.id === this.parent.parent.id) {
              var newIndex = tabItem.parent.parent.children().indexOf(tabItem.parent);
              parentPreview.setFocusedTab(newIndex, true);
            } else {
              unfocus();
            }
          }
        } else if (parentPreview.focusedTab() === index) {
          unfocus();
        }
      }
    }
    /**
     * Get the options instance
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _previewCollection2.prototype.retrieveOptions.call(this);

      delete options.move;
      delete options.title;
      options.remove = new _conditionalRemoveOption(_extends({}, options.remove.config, {
        preview: this
      }));
      return options;
    };

    return Preview;
  }(_previewCollection);

  return Preview;
});
//# sourceMappingURL=preview.js.map
