/*eslint-disable */
define(["underscore", "../config", "./block"], function (_underscore, _config, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Driver =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Driver, _Block);

    function Driver() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Driver.prototype;

    /**
     * Does the driver have a mobile image?
     *
     * @returns {boolean}
     */
    _proto.hasMobileImage = function hasMobileImage() {
      var data = this.getData();
      return !(data.mobile_image === "" || data.mobile_image === undefined || _underscore.isEmpty(data.mobile_image[0]));
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
      }

      if (_underscore.isEmpty(data.image[0])) {
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
      }

      if (_underscore.isEmpty(data.mobile_image[0])) {
        return;
      }

      return {
        src: this.getImageUrl(data.mobile_image),
        alt: data.alt,
        title: data.title_tag
      };
    };
    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */


    _proto.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0].url;

      var mediaUrl = _config.getInitConfig("media_url");

      var mediaPath = imageUrl.split(mediaUrl);
      var directive = "{{media url=" + mediaPath[1] + "}}";
      return directive;
    };

    return Driver;
  }(_block);

  return Driver;
});
//# sourceMappingURL=driver.js.map
