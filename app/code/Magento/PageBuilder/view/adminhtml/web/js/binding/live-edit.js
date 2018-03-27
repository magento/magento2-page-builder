/*eslint-disable */
define(["jquery", "knockout", "mage/translate"], function (_jquery, _knockout, _translate) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _knockout = _interopRequireDefault(_knockout);
  _translate = _interopRequireDefault(_translate);

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
      var contentTypeInstance = bindingContext.$data;
      var data = contentTypeInstance.stage.store.get(contentTypeInstance.id);
      var value = valueAccessor();

      var stripHtml = function stripHtml(html) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.innerText;
      };
      /**
       * Blur event on element
       */


      var onBlur = function onBlur() {
        if (value.field in data) {
          data[value.field] = stripHtml(element.innerText);
          contentTypeInstance.stage.store.update(contentTypeInstance.id, data);
        }
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
      }, 10);
    },

    /**
     * Preprocess live edit binding on an element
     *
     * Use data-placeholder for elements that
     * don't support the placeholder attribute
     *
     * @param {string} value '{"field":"button_text","placeholder_text":"Edit Button Text"}'
     * @param {string} name "liveEdit"
     * @param {any} addBindingCallback
     */
    preprocess: function preprocess(value, name, addBindingCallback) {
      var parsed = JSON.parse(value);

      if ("field" in parsed) {
        var textValue = "preview.data." + parsed.field + "()";
        addBindingCallback("text", textValue);
      }

      if ("placeholder_text" in parsed) {
        var placeholderText = (0, _translate.default)(parsed.placeholder_text);
        var attrValue = "{'data-placeholder':'" + placeholderText + "'}";
        addBindingCallback("attr", attrValue);
      }

      return value;
    }
  };
});
//# sourceMappingURL=live-edit.js.map
