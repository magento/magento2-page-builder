/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/key-codes", "underscore"], function (_jquery, _knockout, _keyCodes, _underscore) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _keyCodes = _interopRequireDefault(_keyCodes);
  _underscore = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */

  /**
   * Add or remove the placeholder-text class from the element based on its content
   *
   * @param {Element} element
   */
  function handlePlaceholderClass(element) {
    if (element.innerHTML.length === 0) {
      (0, _jquery.default)(element).addClass("placeholder-text");
    } else {
      (0, _jquery.default)(element).removeClass("placeholder-text");
    }
  } // Custom Knockout binding for live editing text inputs


  _knockout.default.bindingHandlers.liveEdit = {
    /**
     * Init the live edit binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var _this = this;

      var _valueAccessor = valueAccessor(),
          field = _valueAccessor.field,
          placeholder = _valueAccessor.placeholder;

      var focusedValue = element.innerHTML;
      /**
       * Strip HTML and return text
       *
       * @param {string} html
       * @returns {string}
       */

      var stripHtml = function stripHtml(html) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.innerText;
      };
      /**
       * Record the value on focus, only conduct an update when data changes
       */


      var onFocus = function onFocus() {
        focusedValue = stripHtml(element.innerHTML);
      };
      /**
       * Blur event on element
       */


      var onBlur = function onBlur() {
        if (focusedValue !== stripHtml(element.innerHTML)) {
          viewModel.updateData(field, stripHtml(element.innerHTML));
        }
      };
      /**
       * Click event on element
       */


      var onClick = function onClick() {
        if (element.innerHTML !== "") {
          document.execCommand("selectAll", false, null);
        }
      };
      /**
       * Key down event on element
       *
       * Prevent styling such as bold, italic, and underline using keyboard commands
       * Prevent multi-line entries
       * Debounce the saving of the state to 1 second to ensure that on save without first unfocus will succeed
       *
       * @param {any} event
       */


      var onKeyDown = function onKeyDown(event) {
        var key = _keyCodes.default[event.keyCode]; // command or control

        if (event.metaKey || event.ctrlKey) {
          if (key === "bKey" || key === "iKey" || key === "uKey") {
            event.preventDefault();
          }
        }

        if (key === "enterKey") {
          event.preventDefault();
        } // prevent slides from sliding


        if (key === "pageLeftKey" || key === "pageRightKey") {
          event.stopPropagation();
        }

        _underscore.default.debounce(function () {
          var selection = window.getSelection();
          var range = document.createRange();

          var getCharPosition = function getCharPosition(editableDiv) {
            var charPosition = 0;

            if (window.getSelection) {
              if (selection.rangeCount) {
                if (selection.getRangeAt(0).commonAncestorContainer.parentNode === editableDiv) {
                  charPosition = selection.getRangeAt(0).endOffset;
                }
              }
            }

            return charPosition;
          };

          var pos = getCharPosition(element);

          if (focusedValue !== stripHtml(element.innerHTML)) {
            viewModel.updateData(field, stripHtml(element.innerHTML));
          }

          range.setStart(element.childNodes[0], pos);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 300).call(_this);
      };
      /**
       * Prevent content from being dropped inside of inline edit area
       *
       * @param {DragEvent} event
       */


      var onDrop = function onDrop(event) {
        event.preventDefault();
      };
      /**
       * Input event on element
       */


      var onInput = function onInput() {
        handlePlaceholderClass(element);
      };

      element.setAttribute("data-placeholder", placeholder);
      element.innerText = viewModel.parent.dataStore.get(field);
      element.contentEditable = true;
      element.addEventListener("focus", onFocus);
      element.addEventListener("blur", onBlur);
      element.addEventListener("click", onClick);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("input", onInput);
      element.addEventListener("drop", onDrop);
      (0, _jquery.default)(element).parent().css("cursor", "text");
      handlePlaceholderClass(element); // Create a subscription onto the original data to update the internal value

      viewModel.parent.dataStore.subscribe(function () {
        element.innerText = viewModel.parent.dataStore.get(field);
        handlePlaceholderClass(element);
      }, field);
    },

    /**
     * Update live edit binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */
    update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var _valueAccessor2 = valueAccessor(),
          field = _valueAccessor2.field;

      element.innerText = viewModel.parent.dataStore.get(field);
      handlePlaceholderClass(element);
    }
  };
});
//# sourceMappingURL=live-edit.js.map
