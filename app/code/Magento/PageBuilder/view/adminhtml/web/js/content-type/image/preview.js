/*eslint-disable */
define(["Magento_PageBuilder/js/events", "Magento_PageBuilder/js/content-type/preview", "Magento_PageBuilder/js/uploader"], function (_events, _preview, _uploader) {
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

      return (_temp = _this = _BasePreview.call.apply(_BasePreview, [this].concat(args)) || this, _this.uploader = void 0, _temp) || _this;
    }

    var _proto = Preview.prototype;

    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */
    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * @inheritDoc
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _BasePreview.prototype.bindEvents.call(this);

      _events.on(this.config.name + ":" + this.parent.id + ":updateAfter", function () {
        var dataStore = _this2.parent.dataStore.get();

        var files = dataStore[_this2.config.additional_data.uploaderConfig.dataScope];
        var imageObject = files ? files[0] : {};

        _events.trigger("image:" + _this2.parent.id + ":assignAfter", imageObject);
      });

      _events.on(this.config.name + ":mountAfter", function () {
        var dataStore = _this2.parent.dataStore.get();

        var initialImageValue = dataStore[_this2.config.additional_data.uploaderConfig.dataScope] || ""; // Create uploader

        _this2.uploader = new _uploader("imageuploader_" + _this2.parent.id, _this2.config.additional_data.uploaderConfig, _this2.parent.id, _this2.parent.dataStore, initialImageValue);
      });
    };

    return Preview;
  }(_preview);

  return Preview;
});
//# sourceMappingURL=preview.js.map
