/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/preview", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/uploader"], function (_uiEvents, _preview, _eventBus, _uploader) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_Preview) {
    _inheritsLoose(Image, _Preview);

    function Image() {
      var _temp, _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_temp = _this = _Preview.call.apply(_Preview, [this].concat(args)) || this, _this.uploader = void 0, _temp) || _this;
    }

    var _proto = Image.prototype;

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

      _Preview.prototype.bindEvents.call(this);

      _eventBus.on(this.parent.id + ":updated", function (event, params) {
        var imageDataStore = _this2.parent.store.get(_this2.parent.id);

        var imageObject = imageDataStore.image[0] || {};

        _uiEvents.trigger("image:assigned:" + _this2.parent.id, imageObject);
      });

      _eventBus.once("image:block:ready", function (event, params) {
        var imageDataStore = _this2.parent.store.get(_this2.parent.id);

        var initialImageValue = imageDataStore.image || ""; // Create uploader

        _this2.uploader = new _uploader(_this2.parent.id, "imageuploader_" + _this2.parent.id, Object.assign({}, _this2.config.additional_data.uploaderConfig, {
          value: initialImageValue
        })); // Register listener when image gets uploaded from uploader UI component

        _this2.uploader.onUploaded(_this2.onImageUploaded.bind(_this2));
      });
    };
    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */


    _proto.onImageUploaded = function onImageUploaded(data) {
      this.parent.store.updateKey(this.parent.id, data, "image");
    };

    return Image;
  }(_preview);

  return Image;
});
//# sourceMappingURL=image.js.map
