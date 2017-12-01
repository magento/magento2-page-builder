define(["./block", "../config", "underscore", "../block/factory"], function (_block, _config, _underscore, _factory) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var AdvancedSlider =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(AdvancedSlider, _Block);

    function AdvancedSlider() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = AdvancedSlider.prototype;

    /**
     * Add a slide into the slider
     */
    _proto.addSlide = function addSlide() {
      var _this = this;

      (0, _factory)(_config.getInitConfig('contentTypes')['slide'], this.parent, this.stage, {}).then(function (slide) {
        _this.addChild(slide);

        slide.edit.open();
      });
    };
    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */


    _proto.getImageUrl = function getImageUrl(image) {
      var imageUrl = image[0]['url'],
          mediaUrl = _config.getInitConfig('media_url'),
          mediaPath = imageUrl.split(mediaUrl),
          directive = '{{media url=' + mediaPath[1] + '}}';

      return directive;
    };
    /**
     * Does the driver have a mobile image?
     *
     * @returns {boolean}
     */


    _proto.hasMobileImage = function hasMobileImage() {
      var data = this.getData();
      return !(data.mobile_image == "" || data.mobile_image == undefined || _underscore.isEmpty(data.mobile_image[0]));
    };
    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */


    _proto.getMainImageAttributes = function getMainImageAttributes() {
      var data = this.getData();

      if (data.image == "" || data.image == undefined) {
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

      if (data.mobile_image == "" || data.mobile_image == undefined) {
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

    return AdvancedSlider;
  }(_block);

  return AdvancedSlider;
});
//# sourceMappingURL=advanced-slider.js.map
