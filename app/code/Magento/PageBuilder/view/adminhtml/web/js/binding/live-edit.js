/*eslint-disable */
define(["jquery", "knockout"], function (_jquery, _knockout) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  // Custom Knockout binding for live editing text inputs
  _knockout.default.bindingHandlers.liveEdit = {
    /**
     * Init the live edit binding on an element
     *
     * @param {any} element
     * @param {any} valueAccessor
     * @param {any} allBindings
     * @param {any} viewModel
     * @param {any} bindingContext
     */
    init: function init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var _valueAccessor = valueAccessor(),
          value = _valueAccessor.value,
          placeholder = _valueAccessor.placeholder;

      var stripHtml = function stripHtml(html) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.innerText;
      };
      /**
       * Blur event on element
       */


      var onBlur = function onBlur() {
        value(stripHtml(element.innerText));
      };
      /**
       * Click event on element
       */


      var onClick = function onClick() {
        if (element.innerText !== "") {
          document.execCommand("selectAll", false, null);
        }
      };
      /**
       * Key down event on element
       *
       * @param {any} event
       */


      var onKeyDown = function onKeyDown(event) {
        // command or control
        if (event.metaKey || event.ctrlKey) {
          // b, i, or u
          if (event.which === 66 || event.which === 73 || event.which === 85) {
            event.preventDefault();
          }
        } // enter


        if (event.which === 13) {
          event.preventDefault();
        }
      };
      /**
       * Key up event on element
       */


      var onKeyUp = function onKeyUp() {
        if (element.innerText === "") {
          (0, _jquery.default)(element).addClass("placeholder-text");
        } else {
          (0, _jquery.default)(element).removeClass("placeholder-text");
        }
      };

      element.setAttribute("data-placeholder", placeholder);
      element.innerText = value();
      element.contentEditable = true;
      element.addEventListener("blur", onBlur);
      element.addEventListener("click", onClick);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("keyup", onKeyUp);
      (0, _jquery.default)(element).parent().css("cursor", "text");
      setTimeout(function () {
        if (element.innerText === "") {
          (0, _jquery.default)(element).addClass("placeholder-text");
        }
      }, 0);
    }
  };
});
//# sourceMappingURL=live-edit.js.map
