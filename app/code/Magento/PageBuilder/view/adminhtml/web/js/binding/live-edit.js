/*eslint-disable */
define(["jquery", "knockout", "Magento_Ui/js/lib/key-codes"], function (_jquery, _knockout, _keyCodes) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _keyCodes = _interopRequireDefault(_keyCodes);

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
      };
      /**
       * Input event on element
       */


      var onInput = function onInput() {
        handlePlaceholderClass(element);
      };

      element.setAttribute("data-placeholder", placeholder);
      element.innerText = viewModel.previewData[field]();
      element.contentEditable = true;
      element.addEventListener("focus", onFocus);
      element.addEventListener("blur", onBlur);
      element.addEventListener("click", onClick);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("input", onInput);
      (0, _jquery.default)(element).parent().css("cursor", "text");
      handlePlaceholderClass(element); // Create a subscription onto the original data to update the internal value

      viewModel.previewData[field].subscribe(function (value) {
        element.innerText = viewModel.previewData[field]();
        handlePlaceholderClass(element);
      });
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

      element.innerText = viewModel.previewData[field]();
      handlePlaceholderClass(element);
    }
  };
});
//# sourceMappingURL=live-edit.js.map
