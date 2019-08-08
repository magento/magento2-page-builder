/*eslint-disable */

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

define(["jquery", "Magento_PageBuilder/js/events", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type-menu/hide-show-option", "Magento_PageBuilder/js/wysiwyg/factory", "Magento_PageBuilder/js/content-type/preview"], function (_jquery, _events, _underscore, _config, _hideShowOption, _factory, _preview) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Preview =
  /*#__PURE__*/
  function (_preview2) {
    "use strict";

    _inheritsLoose(Preview, _preview2);

    function Preview() {
      return _preview2.apply(this, arguments) || this;
    }

    var _proto = Preview.prototype;

    /**
     * Wysiwyg instance
     */

    /**
     * The element the text content type is bound to
     */

    /**
     * The textarea element in disabled mode
     */

    /**
     * @returns {Boolean}
     */
    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return _config.getConfig("can_use_inline_editing_on_stage");
    }
    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    ;

    _proto.retrieveOptions = function retrieveOptions() {
      var options = _preview2.prototype.retrieveOptions.call(this);

      options.hideShow = new _hideShowOption({
        preview: this,
        icon: _hideShowOption.showIcon,
        title: _hideShowOption.showText,
        action: this.onOptionVisibilityToggle,
        classes: ["hide-show-content-type"],
        sort: 40
      });
      return options;
    }
    /**
     * @param {HTMLElement} element
     */
    ;

    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this = this;

      this.element = element;
      element.innerHTML = this.data.main.html();
      element.id = this.contentType.id + "-editor";
      var wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;
      wysiwygConfig.adapter.settings.auto_focus = this.contentType.dropped ? element.id : null;
      (0, _factory)(this.contentType.id, element.id, this.config.name, wysiwygConfig, this.contentType.dataStore, "content", this.contentType.stageId).then(function (wysiwyg) {
        _this.wysiwyg = wysiwyg;
      });
    }
    /**
     * @param {HTMLTextAreaElement} element
     */
    ;

    _proto.initTextarea = function initTextarea(element) {
      var _this2 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.contentType.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.contentType.id + ":saveAfter", function () {
        _this2.textarea.value = _this2.contentType.dataStore.get("content");

        _this2.adjustTextareaHeightBasedOnScrollHeight();
      });
    }
    /**
     * Save current value of textarea in data store
     */
    ;

    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.contentType.dataStore.set("content", this.textarea.value);
    }
    /**
     * Start stage interaction on textarea blur
     */
    ;

    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    }
    /**
     * Stop stage interaction on textarea blur
     */
    ;

    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    }
    /**
     * Retrieve the margin & padding & alignment styles for the placeholder
     *
     * @returns {any}
     */
    ;

    _proto.getPlaceholderStyle = function getPlaceholderStyle() {
      var keys = ["marginBottom", "marginLeft", "marginRight", "marginTop", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textAlign"];
      return _underscore.pick(this.data.main.style(), function (style, key) {
        return keys.indexOf(key) !== -1;
      });
    }
    /**
     * Adjust textarea's height based on scrollHeight
     */
    ;

    _proto.adjustTextareaHeightBasedOnScrollHeight = function adjustTextareaHeightBasedOnScrollHeight() {
      this.textarea.style.height = "";
      var scrollHeight = this.textarea.scrollHeight;
      var minHeight = parseInt((0, _jquery)(this.textarea).css("min-height"), 10);

      if (scrollHeight === minHeight) {
        // leave height at 'auto'
        return;
      }

      (0, _jquery)(this.textarea).height(scrollHeight);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map