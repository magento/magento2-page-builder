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
     * @param element
     * @param valueAccessor
     * @param allBindings
     * @param viewModel
     * @param bindingContext
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

      var onBlur = function onBlur() {
        if (value.key in data) {
          data[value.key] = stripHtml(element.innerText);
          contentTypeInstance.stage.store.update(contentTypeInstance.id, data);
        }
      };

      var onClick = function onClick() {
        if (element.innerText !== "") {
          document.execCommand("selectAll", false, null);
        }
      };

      var onKeyDown = function onKeyDown(event) {
        // command or control
        if (event.metaKey || event.ctrlKey) {
          // b, i, or u
          if (event.which === 66 || event.which === 73 || event.which === 85) {
            event.preventDefault();
          }
        }
      };

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
     * @param value "{key:'button_text','data-placeholder':$t('Edit Button Text')}"
     * @param name "liveEdit"
     * @param addBindingCallback
     *
     * Use data-placeholder for elements that
     * don't support the placeholder attribute
     */
    preprocess: function preprocess(value, name, addBindingCallback) {
      var attrValue = "{" + value.split(",")[1];
      var textValue = value.split(",")[0].split("'")[1];
      textValue = "preview.data." + textValue + "()";
      addBindingCallback("attr", attrValue);
      addBindingCallback("text", textValue);
      return value;
    }
  };
});
//# sourceMappingURL=live-edit.js.map
