/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/content-type", "Magento_PageBuilder/js/component/uploader"], function (_uiEvents, _contentType, _uploader) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_ContentType) {
    _inheritsLoose(Image, _ContentType);

    /**
     * Uploader instance
     */

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {number} stageId
     */
    function Image(parent, config, stageId) {
      var _this;

      _this = _ContentType.call(this, parent, config, stageId) || this; // Create uploader

      _this.uploader = void 0;
      _this.uploader = new _uploader(_this.id, "imageuploader_" + _this.id, Object.assign({}, _uploader.getDefaultConfig(), {
        value: _this.store.get(_this.id).image
      })); // Register listener when image gets uploaded from uploader UI component

      _this.uploader.onUploaded(_this.onImageUploaded.bind(_this)); // Notify all subscribers when preview image data gets modified


      _this.preview.previewData.image.subscribe(function (data) {
        _uiEvents.trigger("image:assigned:" + _this.id, data[0]);
      });

      return _this;
    }
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Uploader}
     */


    var _proto = Image.prototype;

    _proto.getUploader = function getUploader() {
      return this.uploader;
    };
    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */


    _proto.onImageUploaded = function onImageUploaded(data) {
      this.store.updateKey(this.id, data, "image");
    };

    return Image;
  }(_contentType);

  return Image;
});
//# sourceMappingURL=image.js.map
