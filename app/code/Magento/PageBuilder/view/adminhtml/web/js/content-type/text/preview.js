/*eslint-disable */
define(["mage/adminhtml/wysiwyg/tiny_mce/setup", "Magento_PageBuilder/js/events", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/preview"], function (_setup, _events, _config, _preview) {
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

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.wysiwygAdapter = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * @inheritDoc
     */
    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this);

      if (!_config.getConfig("can_use_inline_editing_on_stage")) {
        return;
      } // Update content in our stage preview wysiwyg after its slideout counterpart gets updated


      _events.on("form:" + this.parent.id + ":saveAfter", this.setContentFromDataStoreToWysiwyg.bind(this)); // Create wysiwyg instance after content type is rendered


      _events.on(this.config.name + ":renderAfter", function (args) {
        if (args.contentType.id !== _this2.parent.id) {
          // guard against re-instantiation on existing content types
          return;
        }

        _this2.instantiateWysiwyg(); // Update content in our data store after our stage preview wysiwyg gets updated


        _this2.wysiwygAdapter.eventBus.attachEventHandler("tinymceChange", _this2.saveContentFromWysiwygToDataStore.bind(_this2));
      });
    };

    _proto.saveContentFromWysiwygToDataStore = function saveContentFromWysiwygToDataStore() {
      console.log("saveContentFromWysiwygToDataStore");
      this.parent.dataStore.update(this.wysiwygAdapter.getContent(), "content");
    };

    _proto.setContentFromDataStoreToWysiwyg = function setContentFromDataStoreToWysiwyg() {
      console.log("setContentFromDataStoreToWysiwyg");
      this.wysiwygAdapter.setContent(this.parent.dataStore.get("content"));
    };

    _proto.instantiateWysiwyg = function instantiateWysiwyg() {
      this.wysiwygAdapter = new _setup(this.parent.id + "-editor"
      /* TODO - this.config.additional_data... || Config.getConfig("") */
      );
      this.wysiwygAdapter.setup("inline");
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
