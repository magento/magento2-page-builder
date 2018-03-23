/*eslint-disable */
define(["uiEvents", "uiLayout", "uiRegistry", "underscore", "../../utils/url", "../config", "./block", "../uploader"], function (_uiEvents, _uiLayout, _uiRegistry, _underscore, _url, _config, _block, _uploader) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Image =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Image, _Block);

    /**
     * Name of the uploader instance
     */

    /**
     * Configuration passed to uploader upon instantiation
     */

    /**
     * Create image uploader and add listener for when image gets uploaded through this instance
     * {@inheritDoc}
     */
    function Image(parent, stage, config, formData) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData) || this;
      _this.uploaderName = void 0;
      _this.uploaderConfig = _uploader.config;

      _this.createUploader();

      _this.listenImageUploaded();

      return _this;
    }
    /**
     * Register listener when image gets uploaded from uploader UI component
     */


    var _proto = Image.prototype;

    _proto.listenImageUploaded = function listenImageUploaded() {
      _uiEvents.on("image:uploaded:" + this.id, this.onImageUploaded.bind(this));
    };
    /**
     * Update image data inside data store
     *
     * @param {Array} data - list of each files' data
     */


    _proto.onImageUploaded = function onImageUploaded(data) {
      this.stage.store.updateKey(this.id, data, "image");
    };
    /**
     * Instantiate uploader through layout UI component renderer
     */


    _proto.createUploader = function createUploader() {
      this.uploaderName = "imageuploader_" + this.id;
      this.uploaderConfig.name = this.uploaderName;
      this.uploaderConfig.id = this.id; // set reference to current image value in stage's data store

      this.uploaderConfig.value = this.stage.store.get(this.id).image;
      (0, _uiLayout)([this.uploaderConfig]);
    };
    /**
     * Get registry callback reference to uploader UI component
     *
     * @returns {Function}
     */


    _proto.getUploader = function getUploader() {
      return _uiRegistry.async(this.uploaderName);
    };
    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */


    _proto.getMainImageAttributes = function getMainImageAttributes() {
      var data = this.getData();

      if (data.image === "" || data.image === undefined) {
        return {};
      } else if (_underscore.isEmpty(data.image[0])) {
        return;
      }

      return {
        src: this.getImageUrl(data.image),
        alt: data.alt,
        title: data.title_tag
      };
    };
    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */


    _proto.getMobileImageAttributes = function getMobileImageAttributes() {
      var data = this.getData();

      if (data.mobile_image === "" || data.mobile_image === undefined) {
        return {};
      } else if (_underscore.isEmpty(data.mobile_image[0])) {
        return;
      }

      return {
        src: this.getImageUrl(data.mobile_image),
        alt: data.alt,
        title: data.title_tag
      };
    };
    /**
     * Retrieve the image attributes
     *
     * @returns {any}
     */


    _proto.getImageLinkAttributes = function getImageLinkAttributes() {
      var data = this.getData();
      return {
        href: data.link_url || "",
        target: data.link_target || "_self",
        title: data.title_tag
      };
    };
    /**
     * Get the image value held in preview block
     *
     * @returns {String|null}
     */


    _proto.getPreviewImageUrl = function getPreviewImageUrl() {
      return this.preview.data.image() && this.preview.data.image()[0] !== undefined ? this.preview.data.image()[0].url : null;
    };
    /**
     * Retrieve the image URL with directive
     *
     * @param {{}} image
     * @returns {string}
     */


    _proto.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0].url;
      var mediaUrl = (0, _url.convertUrlToPathIfOtherUrlIsOnlyAPath)(_config.getInitConfig("media_url"), imageUrl);
      var mediaPath = imageUrl.split(mediaUrl);
      var directive = "{{media url=" + mediaPath[1] + "}}";
      return directive;
    };

    return Image;
  }(_block);

  return Image;
});
//# sourceMappingURL=image.js.map
