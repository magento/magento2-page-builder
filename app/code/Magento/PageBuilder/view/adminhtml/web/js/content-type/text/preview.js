/*eslint-disable */
define(["jquery", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/wysiwyg"], function (_jquery, _underscore, _config, _preview, _wysiwyg) {
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

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.wysiwyg = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * @param {HTMLElement} element
     */
    _proto.initWysiwyg = function initWysiwyg(element) {
      var _this2 = this;

      if (!_config.getConfig("can_use_inline_editing_on_stage")) {
        return;
      }

      var inlineWysiwygConfig = this.config.additional_data.inlineWysiwygConfig;

      if (inlineWysiwygConfig.encapsulateSelectorConfigKeys) {
        inlineWysiwygConfig = _jquery.extend(true, {}, this.config.additional_data.inlineWysiwygConfig);

        _underscore.each(inlineWysiwygConfig.encapsulateSelectorConfigKeys, function (isEnabled, configKey) {
          var configValue = inlineWysiwygConfig.wysiwygConfig.settings[configKey];

          if (!isEnabled) {
            return;
          }

          inlineWysiwygConfig.wysiwygConfig.settings[configKey] = "#" + _this2.parent.id + (configValue ? " " + configValue : "");
        });
      }

      this.wysiwyg = new _wysiwyg(this.parent.id, element.id, inlineWysiwygConfig.wysiwygConfig, inlineWysiwygConfig.mode, this.parent.dataStore, this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey);
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
