/*eslint-disable */
/* jscs:disable */
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
   * Strip HTML and return text
   *
   * @param {string} html
   * @returns {string}
   */
  function stripHtml(html) {
    if (html) {
      var htmlDocument = new DOMParser().parseFromString(html, "text/html");
      return htmlDocument.body ? htmlDocument.body.textContent : "";
    }

    return html;
  }
  /**
   * Add or remove the placeholder-text class from the element based on its content
   *
   * @param {Element} element
   */


  function handlePlaceholderClass(element) {
    if (stripHtml(element.innerHTML).length === 0) {
      element.innerHTML = "";
      element.classList.add("placeholder-text");
    } else {
      element.classList.remove("placeholder-text");
    }
  } // Custom Knockout binding for live editing text inputs


  _knockout.default.bindingHandlers.liveEdit = {
    /**
     * Init the live edit binding on an element
     *
     * @param {HTMLElement} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var _valueAccessor = valueAccessor(),
          field = _valueAccessor.field,
          placeholder = _valueAccessor.placeholder,
          _valueAccessor$select = _valueAccessor.selectAll,
          selectAll = _valueAccessor$select === void 0 ? false : _valueAccessor$select;

      var focusedValue = element.innerHTML;
      var previouslyFocused = false;
      var blurTimeout;
      var lastUpdateValue;
      /**
       * Record the value on focus, only conduct an update when data changes
       */

      var onFocus = function onFocus() {
        clearTimeout(blurTimeout);
        focusedValue = stripHtml(element.innerHTML);
        lastUpdateValue = focusedValue;

        if (selectAll && element.innerHTML !== "" && !previouslyFocused) {
          _underscore.default.defer(function () {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
            previouslyFocused = true;
          });
        }
      };
      /**
       * On blur change our timeout for previously focused. We require a flag to track whether the input has been
       * focused and selected previously due to a bug in Firefox which doesn't handle focus events correctly when
       * contenteditable is placed within an anchor.
       */


      var onBlur = function onBlur() {
        blurTimeout = setTimeout(function () {
          previouslyFocused = false;
        }, 100);
      };
      /**
       * Mousedown event on element
       *
       * @param {Event} event
       */


      var onMouseDown = function onMouseDown(event) {
        event.stopPropagation();
      };
      /**
       * Key down event on element
       *
       * Prevent styling such as bold, italic, and underline using keyboard commands, and prevent multi-line entries
       *
       * @param {JQueryEventObject} event
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
       * On key up update the view model to ensure all changes are saved
       */


      var onKeyUp = function onKeyUp() {
        var strippedValue = stripHtml(element.innerHTML);

        if (focusedValue !== strippedValue) {
          lastUpdateValue = strippedValue;
          viewModel.updateData(field, strippedValue);
        }
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
       * Prevent content from being dragged
       *
       * @param {DragEvent} event
       */


      var onDragStart = function onDragStart(event) {
        event.preventDefault();
      };
      /**
       * Input event on element
       */


      var onInput = function onInput() {
        handlePlaceholderClass(element);
      };
      /**
       * On paste strip any HTML
       */


      var onPaste = function onPaste() {
        // Record the original caret position so we can ensure we restore it at the correct position
        var selection = window.getSelection();
        var originalPositionStart = selection.getRangeAt(0).cloneRange().startOffset;
        var originalPositionEnd = selection.getRangeAt(0).cloneRange().endOffset;
        var originalContentLength = stripHtml(element.innerHTML).length; // Allow the paste action to update the content

        _underscore.default.defer(function () {
          var strippedValue = stripHtml(element.innerHTML);
          lastUpdateValue = strippedValue;
          element.textContent = strippedValue;
          /**
           * Calculate the position the caret should end up at, the difference in string length + the original
           * end offset position
           */

          var restoredPosition = Math.abs(strippedValue.length - originalContentLength) + originalPositionStart; // If part of the text was selected adjust the position for the removed text

          if (originalPositionStart !== originalPositionEnd) {
            restoredPosition += Math.abs(originalPositionEnd - originalPositionStart);
          }

          var range = document.createRange();
          range.setStart(element.childNodes[0], restoredPosition);
          range.setEnd(element.childNodes[0], restoredPosition);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      };

      element.setAttribute("data-placeholder", placeholder);
      element.textContent = viewModel.contentType.dataStore.get(field);
      element.contentEditable = "true";
      element.addEventListener("focus", onFocus);
      element.addEventListener("blur", onBlur);
      element.addEventListener("mousedown", onMouseDown);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("keyup", onKeyUp);
      element.addEventListener("input", onInput);
      element.addEventListener("drop", onDrop);
      element.addEventListener("paste", onPaste);
      element.addEventListener("dragstart", onDragStart);
      (0, _jquery.default)(element).parent().css("cursor", "text");
      handlePlaceholderClass(element); // Create a subscription onto the original data to update the internal value

      viewModel.contentType.dataStore.subscribe(function (data) {
        // Only update the value if it differs from the last value added within live edit
        if (lastUpdateValue !== data[field]) {
          lastUpdateValue = data[field];
          element.textContent = data[field];
          handlePlaceholderClass(element);
        }
      }, field); // Resolve issues of content editable being within an anchor

      if ((0, _jquery.default)(element).parent().is("a")) {
        (0, _jquery.default)(element).parent().attr("draggable", "false");
      }
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

      element.textContent = viewModel.contentType.dataStore.get(field);
      handlePlaceholderClass(element);
    }
  };
});
//# sourceMappingURL=live-edit.js.map