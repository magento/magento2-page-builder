/*eslint-disable */
define(["jquery", "underscore", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/content-type/wysiwyg"], function (_jquery, _underscore, _events, _config, _preview, _wysiwyg) {
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

          inlineWysiwygConfig.wysiwygConfig.settings[configKey] = _this2.parent.id + (configValue ? " " + configValue : "");
        });
      }

      this.wysiwyg = new _wysiwyg(element.id, inlineWysiwygConfig.wysiwygConfig, inlineWysiwygConfig.mode); // Update content in our data store after our stage preview wysiwyg gets updated

      this.wysiwyg.onEdited(this.saveContentFromWysiwygToDataStore.bind(this));
      this.wysiwyg.onFocused(_events.trigger.bind(null, "stage:interactionStart"));
      this.wysiwyg.onBlurred(_events.trigger.bind(null, "stage:interactionStop")); // Update content in our stage preview wysiwyg after its slideout counterpart gets updated

      _events.on("form:" + this.parent.id + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this));
    };
    /**
     * Update content in our data store after our stage preview wysiwyg gets updated
     */


    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      this.parent.dataStore.update(this.wysiwyg.getAdapter().getContent(), this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey);
    };
    /**
     * Update content in our stage wysiwyg after our data store gets updated
     */


    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      this.wysiwyg.getAdapter().setContent(this.parent.dataStore.get(this.config.additional_data.inlineWysiwygConfig.contentDataStoreKey));
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
