/*eslint-disable */
define(["uiEvents", "underscore", "../../utils/url", "../config", "./block", "../uploader"], function (_uiEvents, _underscore, _url, _config, _block, _uploader) {
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
    function Image(parent, stage, config, formData) {
      var _this;

      _this = _Block.call(this, parent, stage, config, formData) || this; // Create uploader

      _this.uploader = void 0;
      _this.uploader = new _uploader(_this.id, "imageuploader_" + _this.id, Object.assign({}, _uploader.config, {
        value: _this.stage.store.get(_this.id).image
      })); // Register listener when image gets uploaded from uploader UI component

      _this.uploader.onUploaded(_this.onImageUploaded.bind(_this)); // Render uploader


      _this.uploader.render(); // Notify all subscribers when preview image data gets modified


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
