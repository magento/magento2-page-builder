/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/wysiwyg/factory"], function (_jquery, _events, _config, _preview, _factory) {
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

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.wysiwyg = void 0, _this.element = void 0, _this.textarea = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * @returns {Boolean}
     */
    _proto.isWysiwygSupported = function isWysiwygSupported() {
      return _config.getConfig("can_use_inline_editing_on_stage");
    };
    /**
     * @param {HTMLElement} element
     */


    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this2 = this;

      this.element = element;
      element.innerHTML = this.data.main.html();
      element.id = this.parent.id + "-editor";
      var wysiwygConfig = this.config.additional_data.wysiwygConfig.wysiwygConfigData;
      /**
       * Don't include content_css within the inline mode of TinyMCE, if any stylesheets are included here they're
       * appended to the head of the main page, and thus cause other styles to be modified.
       *
       * The styles for typography in the inline editor are scoped within _typography.less
       */

      wysiwygConfig.adapter.tinymce4.content_css = [];
      (0, _factory)(this.parent.id, element.id, this.config.name, wysiwygConfig, this.parent.dataStore, "content").then(function (wysiwyg) {
        _this2.wysiwyg = wysiwyg;
      });
    };
    /**
     * @param {HTMLTextAreaElement} element
     */


    _proto.initTextarea = function initTextarea(element) {
      var _this3 = this;

      this.textarea = element; // set initial value of textarea based on data store

      this.textarea.value = this.parent.dataStore.get("content");
      this.adjustTextareaHeightBasedOnScrollHeight(); // Update content in our stage preview textarea after its slideout counterpart gets updated

      _events.on("form:" + this.parent.id + ":saveAfter", function () {
        _this3.textarea.value = _this3.parent.dataStore.get("content");

        _this3.adjustTextareaHeightBasedOnScrollHeight();
      });
    };
    /**
     * Save current value of textarea in data store
     */


    _proto.onTextareaKeyUp = function onTextareaKeyUp() {
      this.adjustTextareaHeightBasedOnScrollHeight();
      this.parent.dataStore.update(this.textarea.value, "content");
    };
    /**
     * Start stage interaction on textarea blur
     */


    _proto.onTextareaFocus = function onTextareaFocus() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStart");
    };
    /**
     * Stop stage interaction on textarea blur
     */


    _proto.onTextareaBlur = function onTextareaBlur() {
      (0, _jquery)(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

      _events.trigger("stage:interactionStop");
    };
    /**
     * Adjust textarea's height based on scrollHeight
     */


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
