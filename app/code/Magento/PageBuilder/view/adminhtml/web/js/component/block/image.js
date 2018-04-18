/*eslint-disable */
define(["uiEvents", "Magento_PageBuilder/js/component/uploader", "Magento_PageBuilder/js/component/block/block"], function (_uiEvents, _uploader, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Image, _Block);

    /**
     * Uploader instance
     */

    /**
     * Create image uploader and add listener for when image gets uploaded through this instance
     * {@inheritDoc}
     */
    function Image(parent, stage, config, formData, elementConverterPool, dataConverterPool) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData, elementConverterPool, dataConverterPool) || this;
      _this.uploader = void 0;
      var uploaderConfiguration = Object.assign({}, config.additional_data.uploaderConfig.settings, {
        value: _this.stage.store.get(_this.id).image
      }); // Create uploader

      _this.uploader = new _uploader(_this.id, "imageuploader_" + _this.id, uploaderConfiguration); // Register listener when image gets uploaded from uploader UI component

      _this.uploader.onUploaded(_this.onImageUploaded.bind(_this)); // Notify all subscribers when preview image data gets modified


      _this.preview.data.image.subscribe(function (data) {
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
      this.stage.store.updateKey(this.id, data, "image");
    };

    return Image;
  }(_block);

  return Image;
});
//# sourceMappingURL=image.js.map
