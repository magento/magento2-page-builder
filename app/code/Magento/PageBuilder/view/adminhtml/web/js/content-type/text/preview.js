/*eslint-disable */
define(["jquery", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/wysiwyg"], function (_jquery, _config, _preview, _wysiwyg) {
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

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.wysiwyg = void 0, _this.element = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * @param {HTMLElement} element
     */
    _proto.initWysiwyg = function initWysiwyg(element) {
      if (!_config.getConfig("can_use_inline_editing_on_stage")) {
        return;
      }

      this.element = element;
      element.id = this.parent.id + "-editor";
      this.wysiwyg = new _wysiwyg(this.parent.id, element.id, this.config.additional_data.wysiwygConfig.wysiwygConfigData, this.parent.dataStore);
      this.wysiwyg.onFocus(this.onFocus.bind(this));
      this.wysiwyg.onBlur(this.onBlur.bind(this));
    };
    /**
     * Event handler for wysiwyg focus
     * Fixes z-index issues for tabs and column
     */


    _proto.onFocus = function onFocus() {
      var $element = (0, _jquery)(this.element);

      _jquery.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, function (i, selector) {
        $element.closest(selector).css("z-index", 100);
      });
    };
    /**
     * Event handler for wysiwyg blur
     * Fixes z-index issues for tabs and column
     */


    _proto.onBlur = function onBlur() {
      var $element = (0, _jquery)(this.element);

      _jquery.each(this.config.additional_data.wysiwygConfig.parentSelectorsToUnderlay, function (i, selector) {
        $element.closest(selector).css("z-index", "");
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
